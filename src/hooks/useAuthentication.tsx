
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Role, User } from '@/types';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { FallbackState } from '@/components/ui/fallback-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

/**
 * Tipo combinado para o estado de autenticação
 */
export interface AuthenticationState {
  user: User | null;
  session: Session | null;
  role: Role | null;
  solutionId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook centralizado que gerencia toda a autenticação e contexto do usuário
 * Combina funcionalidades do antigo useAuth e useSecureContext em uma API unificada
 * 
 * @returns {Object} Estado de autenticação e métodos relacionados
 */
export function useAuthentication() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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

  /**
   * Converte usuário do Supabase para o formato interno
   */
  const mapSupabaseUser = useCallback((supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
    };
  }, []);

  /**
   * Login com email e senha
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
        setError(signInError.message);
        return null;
      }
      
      const mappedUser = data.user ? mapSupabaseUser(data.user) : null;
      
      if (mappedUser) {
        await createUserRecord(mappedUser);
      }
      
      return mappedUser;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  }, [mapSupabaseUser, createUserRecord]);

  /**
   * Registro de novo usuário
   */
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    try {
      setIsAuthLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (signUpError) {
        setError(signUpError.message);
        return null;
      }
      
      return data.user ? mapSupabaseUser(data.user) : null;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  }, [mapSupabaseUser]);

  /**
   * Login com Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      setError(null);
      
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (googleError) {
        setError(googleError.message);
        return { success: false };
      }
      
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false };
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  /**
   * Logout do usuário
   */
  const signOut = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      setError(null);
      await supabase.auth.signOut();
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error: error.message };
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  /**
   * Recarrega o contexto do usuário
   */
  const refreshContext = useCallback(async () => {
    try {
      setError(null);
      await fetchUserContext();
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  }, [fetchUserContext]);

  useEffect(() => {
    console.log("useAuthentication: Initializing authentication");
    const startTime = performance.now();
    
    // Configurar listener para mudanças de estado de auth primeiro (para não perder eventos)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("useAuthentication: Auth state changed", event, "session exists:", !!newSession);
      
      setSession(newSession);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Agendar operações assíncronas para evitar bloqueio
        setTimeout(() => {
          if (newSession?.user) {
            console.log("useAuthentication: User signed in, ensuring user record exists");
            
            // Criar/atualizar registro do usuário
            createUserRecord(newSession.user).catch(err => {
              console.error("Error creating user record:", err);
              setError(`Error creating user record: ${err.message}`);
            });
          }
          
          // Buscar contexto de usuário atualizado
          fetchUserContext().catch(err => {
            console.error("Error fetching user context after auth change:", err);
            setError(`Error fetching user context: ${err.message}`);
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAuthentication: User signed out");
      }
    });

    // Então verificar a sessão existente
    const checkSession = async () => {
      try {
        setIsAuthLoading(true);
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
        setIsAuthLoading(false);
      }
    };

    checkSession();
    
    console.log(`useAuthentication: Initialization took ${performance.now() - startTime}ms`);

    return () => {
      console.log("useAuthentication: Cleanup - unsubscribing from auth changes");
      subscription.unsubscribe();
    };
  }, [fetchUserContext, createUserRecord]);

  // Estado de loading combinado
  const isLoading = isAuthLoading || contextLoading;
  
  // Estado de erro combinado (priorizar erro de auth sobre erro de contexto)
  const combinedError = error || contextError;

  // Memorizar o estado de autenticação para prevenir re-renderizações desnecessárias
  const authState = useMemo<AuthenticationState>(() => ({
    user,
    session,
    role,
    solutionId,
    isLoading,
    error: combinedError
  }), [user, session, role, solutionId, isLoading, combinedError]);

  /**
   * Componente para exibição do estado de carregamento
   */
  const LoadingSpinner = useCallback(() => {
    if (!isLoading) return null;
    
    return (
      <div className="space-y-4 w-full">
        <FallbackState 
          type="loading" 
          title="Carregando perfil" 
          message="Obtendo dados do seu perfil..." 
        >
          <div className="max-w-md mx-auto mt-4">
            <LoadingSkeleton variant="text" count={3} />
          </div>
        </FallbackState>
      </div>
    );
  }, [isLoading]);

  /**
   * Componente para exibição de erros
   */
  const ErrorDisplay = useCallback(() => {
    if (!combinedError) return null;
    
    return (
      <FallbackState
        type="error"
        title="Erro ao carregar perfil"
        message={`Não foi possível carregar seus dados: ${combinedError}`}
        action={{ label: "Tentar novamente", onClick: () => window.location.reload() }}
      />
    );
  }, [combinedError]);

  return {
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshContext,
    LoadingSpinner,
    ErrorDisplay
  };
}

export default useAuthentication;
