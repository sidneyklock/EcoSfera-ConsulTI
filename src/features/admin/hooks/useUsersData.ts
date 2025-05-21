
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";
import { dispatchUserActionSubmit, dispatchSupabaseQueryError } from "@/utils";
import { usePrefetchQuery } from "@/hooks/usePrefetchQuery";

interface UsersData {
  users: User[];
}

/**
 * Hook for fetching and managing users data with prefetching capability
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
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name');
      
      if (usersError) {
        logger.error({
          userId: user?.id,
          action: "fetch_error",
          message: `Erro ao buscar usuários: ${usersError.message}`,
          data: { error: usersError },
          status: 'fail'
        });
        
        dispatchSupabaseQueryError(
          'users.select',
          `Erro ao buscar usuários: ${usersError.message}`,
          'users',
          usersError.code,
          { details: usersError },
          user
        );
        
        throw new Error(`Error fetching users: ${usersError.message}`);
      }

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
      
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.full_name || user.email.split('@')[0],
          role: 'user' // Default role, would be fetched in a real application
        }))
      };
    } catch (error) {
      logger.error({
        userId: user?.id,
        action: "fetch_error",
        message: "Erro ao buscar usuários",
        data: { error },
        status: 'fail'
      }, error instanceof Error ? error : undefined);
      
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
