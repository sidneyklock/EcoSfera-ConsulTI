
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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
    
    // Obter perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      set({ error: profileError.message });
      return;
    }
    
    // Mapear usuário
    const user = {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
      avatar_url: session.user.user_metadata?.avatar_url,
    };
    
    // Obter papel do usuário
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role_id, solution_id')
      .eq('user_id', user.id)
      .single();
    
    if (roleError && roleError.code !== 'PGRST116') { // Ignora erro "não encontrado"
      set({ error: roleError.message });
      return;
    }
    
    // Obter nome do papel
    let role = null;
    if (userRole?.role_id) {
      const { data: roleData } = await supabase
        .from('roles')
        .select('name')
        .eq('id', userRole.role_id)
        .single();
      
      if (roleData) {
        role = roleData.name;
      }
    }
    
    set({ 
      user, 
      role, 
      solutionId: userRole?.solution_id || null 
    });
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
