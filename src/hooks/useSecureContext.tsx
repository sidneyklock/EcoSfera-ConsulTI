
import { useEffect } from 'react';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
    
    // Inscrever-se para mudanças na autenticação
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
    // Componente acessível de loading para ser usado pelos consumidores
    LoadingSpinner: () => loading ? (
      <div className="flex justify-center items-center h-screen p-4" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-hidden="true"></div>
        <span className="sr-only">Carregando...</span>
      </div>
    ) : null,
    // Componente para exibição de erro
    ErrorDisplay: () => error ? (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro no contexto de segurança</AlertTitle>
        <AlertDescription className="flex flex-col">
          <span>{error}</span>
          <button 
            onClick={() => fetchUserContext()} 
            className="mt-2 text-sm underline hover:text-primary transition-colors"
          >
            Tentar novamente
          </button>
        </AlertDescription>
      </Alert>
    ) : null
  };
}
