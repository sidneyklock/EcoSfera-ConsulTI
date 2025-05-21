
import { useEffect } from 'react';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { FallbackState } from '@/components/ui/fallback-state';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook que fornece o contexto seguro do usuário atual
 * Gerencia a autenticação do usuário e dados relacionados à solução/perfil
 * @returns { user, solutionId, role, loading, error } - Dados do contexto seguro
 */
export function useSecureContext() {
  const { 
    user, 
    solutionId, 
    role, 
    loading, 
    error, 
    fetchUserContext,
    createUserRecord
  } = useSecureContextStore();

  useEffect(() => {
    console.log("useSecureContext: Initializing secure context");
    
    // Fetch user context immediately
    fetchUserContext().catch(err => {
      console.error("Error in initial fetchUserContext:", err);
    });
    
    // Subscribe to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useSecureContext: Auth state changed", event, "session exists:", !!session);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Schedule async operations to avoid blocking
        setTimeout(() => {
          if (session?.user) {
            const authUser = session.user;
            console.log("useSecureContext: User signed in, ensuring user record exists", authUser.email);
            
            // Create/update user record
            createUserRecord(authUser).catch(err => {
              console.error("Error creating user record:", err);
            });
          }
          
          // Fetch updated user context
          fetchUserContext().catch(err => {
            console.error("Error fetching user context after auth change:", err);
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("useSecureContext: User signed out");
        setTimeout(() => {
          fetchUserContext().catch(err => {
            console.error("Error fetching user context after sign out:", err);
          });
        }, 0);
      }
    });

    return () => {
      console.log("useSecureContext: Cleanup - unsubscribing from auth changes");
      subscription.unsubscribe();
    };
  }, [fetchUserContext, createUserRecord]);

  return { 
    user, 
    solutionId, 
    role, 
    loading, 
    error,
    // Accessible loading component for consumers
    LoadingSpinner: () => loading ? (
      <FallbackState 
        type="loading" 
        title="Carregando perfil" 
        message="Obtendo dados do seu perfil..." 
      />
    ) : null,
    // Error display component
    ErrorDisplay: () => error ? (
      <FallbackState
        type="error"
        title="Erro ao carregar perfil"
        message={`Não foi possível carregar seus dados: ${error}`}
      />
    ) : null
  };
}
