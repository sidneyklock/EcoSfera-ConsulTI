
import { useAuthActions } from './useAuthActions';
import { useAuthContext } from './useAuthContext';
import { useAuthSession } from './useAuthSession';

/**
 * Hook principal de autenticação que combina todas as funcionalidades
 * Este hook substitui useAuthentication e useAuthService
 */
export function useAuth() {
  const actions = useAuthActions();
  const context = useAuthContext();
  const { session } = useAuthSession();
  
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
