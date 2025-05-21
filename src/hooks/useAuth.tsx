
/**
 * Este arquivo é mantido apenas para compatibilidade com o código existente.
 * Recomenda-se utilizar o hook useAuth do diretório features.
 * @deprecated Use useAuth from @/features/auth/hooks instead
 */

import { useMemo } from 'react';
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";
import { useAuth as useNewAuth } from '@/features/auth/hooks/useAuth';

export function useAuth() {
  const newAuth = useNewAuth();
  
  // Log hook usage to help identify where deprecated hook is still being used
  if (process.env.NODE_ENV !== 'production') {
    logger.debug({
      action: "deprecated_hook_used",
      message: "useAuth (legacy) is deprecated, use useAuth from features/auth/hooks instead",
      data: { 
        stack: new Error().stack?.split('\n').slice(2).join('\n') 
      }
    });
  }
  
  // Mapeando para a estrutura antiga do hook para compatibilidade retroativa
  const authState = useMemo(() => ({
    user: newAuth.user,
    role: newAuth.role,
    solutionId: newAuth.solutionId,
    isLoading: newAuth.isLoading,
    error: newAuth.error
  }), [newAuth.user, newAuth.role, newAuth.solutionId, newAuth.isLoading, newAuth.error]);
  
  return { 
    authState,
    signIn: newAuth.signIn,
    signUp: newAuth.signUp,
    signOut: newAuth.signOut,
    signInWithGoogle: newAuth.signInWithGoogle,
    refreshContext: newAuth.refetchContext
  };
}

export default useAuth;
