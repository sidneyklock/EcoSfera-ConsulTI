
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';

/**
 * Login com Google
 */
export const signInWithGoogle = async (set: Function) => {
  const methodStart = performance.now();
  try {
    set({ isLoading: true, error: null });
    
    logger.debug({
      action: "auth_google_start",
      message: "Iniciando processo de login com Google"
    });
    
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (googleError) {
      logger.warn({
        action: "auth_google_error",
        message: `Erro no login com Google: ${googleError.message}`,
        data: { error: googleError }
      });
      
      set({ error: googleError.message });
      toast.error(googleError.message);
      return { success: false };
    }
    
    logger.info({
      action: "auth_google_redirect",
      message: "Redirecionando para autenticação Google"
    });
    
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.message || "Erro ao iniciar login com Google";
    logger.error({
      action: "auth_google_exception",
      message: errorMessage,
      data: { error, stack: error.stack }
    });
    
    set({ error: errorMessage });
    toast.error(errorMessage);
    return { success: false };
  } finally {
    const duration = performance.now() - methodStart;
    
    logger.debug({
      action: "auth_google_complete",
      message: `Processo de login com Google concluído em ${duration.toFixed(2)}ms`,
      data: { durationMs: duration }
    });
    
    set({ isLoading: false });
  }
};
