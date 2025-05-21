
import { logger } from "@/utils/logger";
import { User } from "@/types";

/**
 * Interface para estatísticas administrativas
 */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
}

/**
 * Interface para estatísticas de usuários
 */
export interface UserStats {
  messages: number;
  projectsCompleted: number;
  tasksPending: number;
  nextMeeting: string;
}

/**
 * Serviço para fornecer dados ao dashboard
 * Centraliza acesso a dados e lógica de negócios relacionada ao dashboard
 */
export const dashboardService = {
  /**
   * Obtém estatísticas para administradores
   */
  getAdminStats: async (user?: User | null): Promise<AdminStats> => {
    try {
      logger.info({
        userId: user?.id,
        action: "dashboard_admin_stats_load",
        message: "Carregando estatísticas administrativas"
      });
      
      // Simulação de carregamento de dados
      // Em produção, isso seria substituído por chamadas ao banco de dados real
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Dados simulados para desenvolvimento
      const stats: AdminStats = {
        totalUsers: 1293,
        activeUsers: 857,
        totalProjects: 42,
        activeProjects: 24,
      };
      
      return stats;
    } catch (error) {
      logger.error({
        userId: user?.id,
        action: "dashboard_admin_stats_error",
        message: "Erro ao carregar estatísticas administrativas",
        data: { error }
      });
      
      throw error;
    }
  },

  /**
   * Obtém estatísticas para usuários regulares
   */
  getUserStats: async (user?: User | null): Promise<UserStats> => {
    try {
      logger.info({
        userId: user?.id,
        action: "dashboard_user_stats_load",
        message: "Carregando estatísticas do usuário"
      });
      
      // Simulação de carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Dados simulados para desenvolvimento
      const stats: UserStats = {
        messages: 24,
        projectsCompleted: 3,
        tasksPending: 8,
        nextMeeting: "Hoje, 15:00",
      };
      
      return stats;
    } catch (error) {
      logger.error({
        userId: user?.id,
        action: "dashboard_user_stats_error",
        message: "Erro ao carregar estatísticas do usuário",
        data: { error }
      });
      
      throw error;
    }
  }
};
