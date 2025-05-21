
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';
import { fetchLogger } from '@/utils/fetchLogger';

/**
 * Logout
 */
export const signOut = async (set: Function, get: Function) => {
  const methodStart = performance.now();
  const state = get();
  const user = state.user;
  
  try {
    set({ isLoading: true, error: null });
    
    logger.debug({
      userId: user?.id,
      action: "auth_signout_start",
      message: "Iniciando processo de logout"
    });
    
    // Usar fetchLogger para melhor rastreamento de desempenho
    await fetchLogger.withLogs(
      "auth_signout",
      async () => await supabase.auth.signOut(),
      user,
      "Iniciando logout no Supabase",
      () => "Logout processado com sucesso no Supabase",
      "Erro ao processar logout no Supabase"
    );
    
    set({ user: null, role: null, solutionId: null });
    toast.success("Logout realizado com sucesso");
    
    logger.info({
      userId: user?.id,
      action: "auth_signout_success",
      message: "Logout realizado com sucesso"
    });
    
  } catch (error: any) {
    const errorMessage = error.message || "Erro ao realizar logout";
    logger.error({
      userId: user?.id,
      action: "auth_signout_exception",
      message: errorMessage,
      data: { error, stack: error.stack }
    });
    
    set({ error: errorMessage });
    toast.error(errorMessage);
    
  } finally {
    const duration = performance.now() - methodStart;
    
    logger.debug({
      userId: user?.id,
      action: "auth_signout_complete",
      message: `Processo de logout concluído em ${duration.toFixed(2)}ms`,
      data: { durationMs: duration }
    });
    
    set({ isLoading: false });
  }
};
