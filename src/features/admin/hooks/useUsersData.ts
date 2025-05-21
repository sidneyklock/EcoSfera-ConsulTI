
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";
import { dispatchUserActionSubmit, dispatchUserActionError, dispatchSupabaseQueryError } from "@/utils";

interface UsersData {
  users: User[];
}

export function useUsersData() {
  const { data: userData } = useUserContext();
  const user = userData?.user;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UsersData> => {
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
        
        dispatchUserActionError(
          "fetch_users", 
          "useUsersData",
          error instanceof Error ? error.message : "Erro desconhecido",
          { queryKey: "users" },
          user
        );
        
        throw error;
      }
    }
  });

  return { data, isLoading, error, refetch };
}
