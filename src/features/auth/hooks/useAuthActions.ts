
import { useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { logger } from "@/utils/logger";

interface AuthActionsResult {
  handleSignOut: () => Promise<void>;
  isAuthenticated: boolean;
  userName: string | undefined;
}

/**
 * Hook para gerenciar ações de autenticação
 * Centraliza a lógica de logout e informações de usuário
 */
export function useAuthActions(): AuthActionsResult {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  // Nome para exibição do usuário
  const userName = user?.name || user?.email?.split("@")[0] || undefined;

  // Memoize a função de logout para prevenir rerenders desnecessários
  const handleSignOut = useCallback(async () => {
    try {
      logger.info({
        userId: user?.id,
        action: "user_signout",
        message: "Usuário iniciou processo de logout"
      });
      
      await signOut();
      navigate("/login");
    } catch (error) {
      logger.error({
        userId: user?.id,
        action: "signout_error",
        message: "Erro ao fazer logout",
        data: { error }
      });
    }
  }, [signOut, navigate, user?.id]);

  return {
    handleSignOut,
    isAuthenticated: !!user,
    userName
  };
}
