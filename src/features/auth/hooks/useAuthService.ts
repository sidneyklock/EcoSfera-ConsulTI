
import { useAuth } from './useAuth';
import { logger } from "@/utils/logger";

/**
 * Hook consolidado que centraliza toda a lógica de autenticação da aplicação
 * Este hook agora é uma camada de compatibilidade sobre o novo useAuth
 * @deprecated Use useAuth from @/features/auth/hooks instead
 */
export function useAuthService() {
  const auth = useAuth();
  
  // Inicialização do hook para métricas
  logger.debug({
    userId: auth.user?.id,
    action: "hook_initialized",
    message: "useAuthService hook initialized (compatibility layer)",
    data: { hasUser: !!auth.user }
  });

  return {
    user: auth.user,
    role: auth.role,
    solutionId: auth.solutionId,
    isLoading: auth.isLoading,
    error: auth.error,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithGoogle: auth.signInWithGoogle,
    refreshContext: auth.refetchContext
  };
}
