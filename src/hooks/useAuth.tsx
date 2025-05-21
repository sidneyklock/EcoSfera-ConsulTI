
/**
 * Este arquivo é mantido apenas para compatibilidade com o código existente.
 * Recomenda-se utilizar o hook useAuthService do diretório features.
 * @deprecated Use useAuthService from @/features/auth/hooks instead
 */

import { useAuth as useAuthContext } from "@/context/AuthContext";
import { logger } from "@/utils/logger";

export function useAuth() {
  const auth = useAuthContext();
  
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
  
  // Extraindo os dados do contexto e convertendo para o formato esperado pelos componentes existentes
  const {
    authState: { user, isLoading, error, role, solutionId, session },
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  } = auth;
  
  // Mantendo o formato compatível com o código existente
  return {
    user,
    role,
    solutionId,
    isLoading,
    error,
    signIn,
    signUp, 
    signOut,
    signInWithGoogle,
    refreshContext: async () => {
      try {
        logger.debug({
          userId: user?.id,
          action: "refresh_context",
          message: "Manual context refresh requested"
        });
        return { success: true };
      } catch (err) {
        logger.error({
          userId: user?.id,
          action: "refresh_context_error",
          message: "Error refreshing context",
          data: { error: err }
        });
        return { success: false, error: err };
      }
    },
  };
}

export default useAuth;
