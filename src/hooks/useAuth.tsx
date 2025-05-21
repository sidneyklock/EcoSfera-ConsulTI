
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
  
  return auth;
}

export default useAuth;
