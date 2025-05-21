
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Role } from "@/types";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    activeProjects: number;
  };
}

/**
 * Hook to fetch dashboard data from Supabase
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useDashboardData() {
  const { data: userData } = useUserContext();
  const user = userData?.user;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async (): Promise<DashboardData> => {
      logger.info({
        userId: user?.id,
        action: "fetch_start",
        message: "Iniciando busca de dados do dashboard",
        status: 'success'
      });

      try {
        // In a real application, this would fetch actual statistics from Supabase
        // For now, we're returning static data as in the original components
        
        // Example of how you would fetch real data:
        // const { data: users, error: usersError } = await supabase
        //   .from('users')
        //   .select('count');
        
        // if (usersError) {
        //   logger.error({
        //     userId: user?.id,
        //     action: "fetch_error",
        //     message: `Erro ao buscar contagem de usuários: ${usersError.message}`,
        //     data: { error: usersError },
        //     status: 'fail'
        //   });
        //   throw new Error(`Error fetching users: ${usersError.message}`);
        // }

        // Simulate a fetch delay for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return simulated dashboard data
        const dashboardData = {
          stats: {
            totalUsers: 1293,
            activeUsers: 857,
            totalProjects: 42,
            activeProjects: 24
          }
        };
        
        logger.info({
          userId: user?.id,
          action: "fetch_success",
          message: "Dados do dashboard carregados com sucesso",
          data: { stats: dashboardData.stats },
          status: 'success'
        });

        return dashboardData;
      } catch (error) {
        logger.error({
          userId: user?.id,
          action: "fetch_error",
          message: "Erro ao buscar dados do dashboard",
          data: { error },
          status: 'fail'
        }, error instanceof Error ? error : undefined);
        throw error;
      }
    }
  });

  return { data, isLoading, error, refetch };
}
