
/**
 * Este arquivo é mantido apenas para compatibilidade com o código existente.
 * Recomenda-se utilizar o hook useAuthService do diretório features.
 * @deprecated Use useAuthService from @/features/auth/hooks instead
 */

import { useMemo } from 'react';
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";

export function useAuth() {
  const {
    user,
    role,
    solutionId, 
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshContext
  } = useAuthStore();
  
  // Log hook usage to help identify where deprecated hook is still being used
  if (process.env.NODE_ENV !== 'production') {
    logger.debug({
      action: "deprecated_hook_used",
      message: "useAuth is deprecated, use useAuthService instead",
      data: { 
        stack: new Error().stack?.split('\n').slice(2).join('\n') 
      }
    });
  }
  
  // Mapeando para a estrutura antiga do hook para compatibilidade retroativa
  const authState = useMemo(() => ({
    user,
    role,
    solutionId,
    isLoading,
    error
  }), [user, role, solutionId, isLoading, error]);
  
  return { 
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshContext
  };
}

export default useAuth;
