
import { useCallback } from "react";
import { User } from "@/types";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";
import { dispatchUserActionSubmit, dispatchSupabaseQueryError } from "@/utils";
import { usePrefetchQuery } from "@/hooks/usePrefetchQuery";
import { adminService } from "../services/adminService";

interface UsersData {
  users: User[];
}

/**
 * Hook for fetching and managing users data with prefetching capability
 * Agora usa o adminService centralizado para acesso a dados
 */
export function useUsersData() {
  const { data: userData } = useUserContext();
  const user = userData?.user;

  // Query function with standardized error handling
  const fetchUsers = useCallback(async (): Promise<UsersData> => {
    logger.info({
      userId: user?.id,
      action: "fetch_start",
      message: "Iniciando busca de usuários",
      status: 'success'
    });

    dispatchUserActionSubmit("fetch_users", "useUsersData", { queryKey: "users" }, user);

    try {
      // Usa adminService para buscar usuários
      const users = await adminService.getUsers(user?.id);
      
      // Verificar se retornou dados vazios
      if (!users || users.length === 0) {
        logger.info({
          userId: user?.id,
          action: "fetch_empty",
          message: "Nenhum usuário encontrado",
          status: 'success'
        });
        
        return { users: [] };
      }
      
      logger.info({
        userId: user?.id,
        action: "fetch_success",
        message: `${users.length} usuários carregados com sucesso`,
        data: { count: users.length },
        status: 'success'
      });
      
      return { users };
    } catch (error) {
      logger.error({
        userId: user?.id,
        action: "fetch_error",
        message: "Erro ao buscar usuários",
        data: { error },
        status: 'fail'
      }, error instanceof Error ? error : undefined);
      
      if (error instanceof Error) {
        dispatchSupabaseQueryError(
          'users.select',
          `Erro ao buscar usuários: ${error.message}`,
          'users',
          'unknown',
          { details: error },
          user
        );
      }
      
      throw error;
    }
  }, [user]);

  // Use the prefetchQuery hook
  return usePrefetchQuery<UsersData>(
    ["users"],
    fetchUsers,
    { 
      staleTime: 1000 * 60 * 3, // 3 minutes
      enabled: !!user?.id 
    },
    user
  );
}
