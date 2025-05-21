
import { useEffect, useState, useCallback, useMemo } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Role, User } from '@/types';
import { useSecureContextStore } from '@/stores/secureContextStore';

export type AuthState = {
  user: User | null;
  session: Session | null;
  role: Role | null;
  solutionId: string | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook centralizado para estado de autenticação
 * Combina auth do Supabase e contexto seguro
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    user, 
    role, 
    solutionId, 
    loading: contextLoading, 
    error: contextError,
    fetchUserContext,
    createUserRecord
  } = useSecureContextStore();

  // Converte usuário do Supabase para nosso tipo User
  const mapSupabaseUser = useCallback((supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Estado de loading combinado
  const loading = isLoading || contextLoading;
  
  // Estado de erro combinado (priorizar erro de auth sobre erro de contexto)
  const combinedError = error || contextError;

  // Memorizar o estado de auth para prevenir re-renderizações desnecessárias
  const authState = useMemo<AuthState>(() => ({
    user,
    session,
    role,
    solutionId,
    isLoading: loading,
    error: combinedError
  }), [user, session, role, solutionId, loading, combinedError]);

  useEffect(() => {
    console.log("useAuth: Initializing authentication state");
    const startTime = performance.now();
    
    // Configurar listener para mudanças de estado de auth primeiro (para não perder eventos)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("useAuth: Auth state changed", event);
      
      setSession(newSession);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Agendar operações assíncronas para evitar bloqueio
        setTimeout(() => {
          if (newSession?.user) {
            console.log("useAuth: User signed in, ensuring user record exists");
            
            // Criar/atualizar registro do usuário
            createUserRecord(newSession.user).catch(err => {
              console.error("Error creating user record:", err);
              setError(`Error creating user record: ${err.message}`);
            });
          }
          
          // Buscar contexto de usuário atualizado
          fetchUserContext().catch(err => {
            console.error("Error fetching user context after auth change:", err);
            setError(`Error fetching context: ${err.message}`);
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAuth: User signed out");
      }
    });

    // Então verificar a sessão existente
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          // Buscar contexto do usuário se tivermos uma sessão
          await fetchUserContext();
        }
      } catch (err: any) {
        console.error("Error checking session:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    
    console.log(`useAuth: Initialization took ${performance.now() - startTime}ms`);

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserContext, createUserRecord]);

  return {
    ...authState,
    signOut,
    refreshContext: fetchUserContext
  };
}
