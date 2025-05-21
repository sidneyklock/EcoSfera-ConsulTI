
import { useAuthActions } from './useAuthActions';
import { useAuthContext } from './useAuthContext';
import { useAuthSession } from './useAuthSession';
import { logger } from "@/utils/logger";

/**
 * Hook principal de autenticação que consolida toda funcionalidade
 * Substitui todos os hooks legados (useAuthentication, useAuthService, etc)
 */
export function useAuth() {
  const actions = useAuthActions();
  const context = useAuthContext();
  const { session } = useAuthSession();
  
  // Logging para rastrear uso
  logger.debug({
    action: "hook_used",
    message: "useAuth hook called",
    data: { isAuthenticated: !!context.user }
  });
  
  return {
    // Dados do usuário e contexto
    user: context.user,
    role: context.role,
    solutionId: context.solutionId,
    isLoading: context.isLoading,
    error: context.error,
    isAuthenticated: context.isAuthenticated,
    session,
    
    // Ações de autenticação
    signIn: actions.signIn,
    signUp: actions.signUp,
    signOut: actions.signOut,
    signInWithGoogle: actions.signInWithGoogle,
    
    // Utilitários
    refetchContext: context.refetchContext,
    hasRole: context.hasRole
  };
}
