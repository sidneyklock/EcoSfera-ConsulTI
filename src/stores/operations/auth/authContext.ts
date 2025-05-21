
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { mapUserFromAuth } from './mappers';

/**
 * Atualizar contexto do usuário
 */
export const refreshContext = async (set: Function) => {
  try {
    set({ isLoading: true, error: null });
    
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      set({ user: null, role: null, solutionId: null });
      return;
    }
    
    // Busca os dados do usuário na tabela 'users'
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      logger.warn({
        action: "auth_refresh_user_fetch_error",
        message: `Erro ao buscar dados do usuário: ${userError.message}`,
        data: { userError }
      });
      set({ error: userError.message });
      return;
    }

    const user = mapUserFromAuth(session.user, userData);
    set({ user, error: null });
    
  } catch (error: any) {
    logger.error({
      action: "auth_refresh_exception",
      message: error.message || "Erro ao atualizar contexto do usuário",
      data: { error, stack: error.stack }
    });
    set({ error: error.message || "Erro ao atualizar contexto do usuário" });
  } finally {
    set({ isLoading: false });
  }
};
