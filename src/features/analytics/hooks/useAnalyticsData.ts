
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { useUserContext } from "@/features/auth/hooks";

interface AnalyticsData {
  monthlyData: Array<{
    name: string;
    value: number;
    users: number;
  }>;
}

export function useAnalyticsData() {
  const { data: userData } = useUserContext();
  const user = userData?.user;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: async (): Promise<AnalyticsData> => {
      logger.info({
        userId: user?.id,
        action: "fetch_start",
        message: "Iniciando busca de dados analíticos",
        status: 'success'
      });

      try {
        // In a real application, this would fetch actual statistics from Supabase
        // For now, we're returning static data as in the original components
        
        // Example of how you would fetch real data:
        // const { data: analyticsData, error: analyticsError } = await supabase
        //   .from('analytics')
        //   .select('*');
        
        // if (analyticsError) {
        //   logger.error({
        //     userId: user?.id,
        //     action: "fetch_error",
        //     message: `Error fetching analytics: ${analyticsError.message}`,
        //     data: { error: analyticsError },
        //     status: 'fail'
        //   });
        //   throw new Error(`Error fetching analytics: ${analyticsError.message}`);
        // }

        // Simulate a fetch delay for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 300));

        const analyticsData = {
          monthlyData: [
            { name: "Jan", value: 5, users: 10 },
            { name: "Feb", value: 8, users: 15 },
            { name: "Mar", value: 12, users: 18 },
            { name: "Apr", value: 19, users: 25 },
            { name: "May", value: 15, users: 30 },
            { name: "Jun", value: 24, users: 32 },
            { name: "Jul", value: 35, users: 45 },
            { name: "Aug", value: 30, users: 50 },
            { name: "Sep", value: 42, users: 55 },
            { name: "Oct", value: 38, users: 48 },
            { name: "Nov", value: 45, users: 60 },
            { name: "Dec", value: 55, users: 70 },
          ]
        };
        
        logger.info({
          userId: user?.id,
          action: "fetch_success",
          message: "Dados analíticos carregados com sucesso",
          data: { dataPoints: analyticsData.monthlyData.length },
          status: 'success'
        });

        return analyticsData;
      } catch (error) {
        logger.error({
          userId: user?.id,
          action: "fetch_error",
          message: "Erro ao buscar dados analíticos",
          data: { error },
          status: 'fail'
        }, error instanceof Error ? error : undefined);
        throw error;
      }
    }
  });

  return { data, isLoading, error, refetch };
}
