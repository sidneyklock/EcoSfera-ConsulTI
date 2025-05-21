
import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
}

interface UserStats {
  messages: number;
  projectsCompleted: number;
  tasksPending: number;
  nextMeeting: string;
}

interface StatsData {
  adminStats: AdminStats;
  userStats: UserStats;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para gerenciar os dados estatísticos do dashboard
 * Separa a lógica de obtenção de dados da sua apresentação
 */
export function useStatsData(): StatsData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: userData } = useUserContext();
  const user = userData?.user;

  // Dados simulados (seriam obtidos por API em produção)
  const [adminStats] = useState<AdminStats>({
    totalUsers: 1293,
    activeUsers: 857,
    totalProjects: 42,
    activeProjects: 24,
  });

  const [userStats] = useState<UserStats>({
    messages: 24,
    projectsCompleted: 3,
    tasksPending: 8,
    nextMeeting: "Hoje, 15:00",
  });

  useEffect(() => {
    // Simulação de carregamento de dados
    const loadData = async () => {
      try {
        setIsLoading(true);
        logger.info({
          userId: user?.id,
          action: "stats_data_load",
          message: "Carregando dados estatísticos do dashboard"
        });
        
        // Simular um tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 300));
        
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
