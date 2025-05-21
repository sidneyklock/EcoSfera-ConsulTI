
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { User } from "@/types";

/**
 * Serviço centralizado para funcionalidades administrativas
 * Isolando acesso a dados e lógica de negócios
 */
export const adminService = {
  /**
   * Registra uma ação administrativa no sistema
   */
  logAdminAction: async (action: string, entityTable: string, entityId: string | null, details: object = {}) => {
    try {
      await supabase.rpc('log_admin_action', {
        action,
        entity_table: entityTable,
        entity_id: entityId,
        details: { ...details, timestamp: new Date().toISOString() }
      });
      
      logger.info({
        action: "admin_action_logged",
        message: `Ação administrativa registrada: ${action}`,
        data: { entityTable, entityId }
      });
      
      return { success: true };
    } catch (error) {
      logger.error({
        action: "admin_log_error",
        message: "Erro ao registrar ação administrativa",
        data: { error, action, entityTable, entityId }
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      };
    }
  },
  
  /**
   * Obtém dados de usuários para administração
   */
  getUsers: async (userId?: string): Promise<User[]> => {
    try {
      logger.info({
        userId,
        action: "admin_fetch_users",
        message: "Iniciando busca de usuários pelo admin"
      });

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name');
      
      if (usersError) {
        throw new Error(`Erro ao buscar usuários: ${usersError.message}`);
      }
      
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        role: 'user' // Default role, would be fetched in a real application
      }));
    } catch (error) {
      logger.error({
        userId,
        action: "admin_fetch_users_error",
        message: "Erro ao buscar usuários",
        data: { error }
      });
      
      throw error;
    }
  }
};
