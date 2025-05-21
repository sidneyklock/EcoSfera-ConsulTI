
import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";
import { AdminStats, UserStats, dashboardService } from "../services/dashboardService";

interface StatsData {
  adminStats: AdminStats;
  userStats: UserStats;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para gerenciar os dados estatísticos do dashboard
 * Separa a lógica de obtenção de dados da sua apresentação
 * Agora usa o serviço centralizado dashboardService
 */
export function useStatsData(): StatsData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    messages: 0,
    projectsCompleted: 0,
    tasksPending: 0,
    nextMeeting: "",
  });
  
  const { data: userData } = useUserContext();
  const user = userData?.user;

  useEffect(() => {
    // Carrega dados de estatísticas usando o serviço centralizado
    const loadData = async () => {
      try {
        setIsLoading(true);
        logger.info({
          userId: user?.id,
          action: "stats_data_load",
          message: "Carregando dados estatísticos do dashboard"
        });
        
        // Carrega ambas estatísticas em paralelo para melhor performance
        const [adminStatsData, userStatsData] = await Promise.all([
          dashboardService.getAdminStats(user),
          dashboardService.getUserStats(user)
        ]);
        
        setAdminStats(adminStatsData);
        setUserStats(userStatsData);
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Erro desconhecido ao carregar estatísticas");
        setError(error);
        setIsLoading(false);
        
        logger.error({
          userId: user?.id,
          action: "stats_data_error",
          message: "Erro ao carregar dados estatísticos",
          data: { error: error.message }
        });
      }
    };

    loadData();
  }, [user?.id]);

  return {
    adminStats,
    userStats,
    isLoading,
    error
  };
}
