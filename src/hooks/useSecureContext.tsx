
import { useEffect } from 'react';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';

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
    fetchUserContext 
  } = useSecureContextStore();

  useEffect(() => {
    fetchUserContext();
    
    // Inscrever-se para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserContext();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserContext]);

  return { 
    user, 
    solutionId, 
    role, 
    loading, 
    error,
    // Componente acessível de loading para ser usado pelos consumidores
    LoadingSpinner: () => loading ? (
      <div className="flex justify-center items-center p-4" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-hidden="true"></div>
        <span className="sr-only">Carregando...</span>
      </div>
    ) : null
  };
}
