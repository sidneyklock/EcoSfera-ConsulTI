
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Role } from "@/types";

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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async (): Promise<DashboardData> => {
      // In a real application, this would fetch actual statistics from Supabase
      // For now, we're returning static data as in the original components
      
      // Example of how you would fetch real data:
      // const { data: users, error: usersError } = await supabase
      //   .from('users')
      //   .select('count');
      
      // if (usersError) throw new Error(`Error fetching users: ${usersError.message}`);

      // Return simulated dashboard data
      return {
        stats: {
          totalUsers: 1293,
          activeUsers: 857,
          totalProjects: 42,
          activeProjects: 24
        }
      };
    }
  });

  return { data, isLoading, error, refetch };
}
