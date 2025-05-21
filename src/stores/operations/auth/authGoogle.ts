
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { GoogleSignInResult } from '@/types/auth.types';

/**
 * Login com o Google
 * @returns Resultado da operação de login com Google
 */
export const signInWithGoogle = async (set: Function): Promise<GoogleSignInResult> => {
  const methodStart = performance.now();
  try {
    set({ isLoading: true, error: null });

    logger.debug({
      action: "auth_google_signin_start",
      message: "Iniciando processo de login com Google"
    });
    
    // Obter URL atual para configurar corretamente o redirecionamento
    const currentUrl = window.location.origin;
    console.log("URL de origem para redirecionamento:", currentUrl);
    
    const redirectTo = `${currentUrl}/auth/callback`;
    console.log("URL de redirecionamento completa:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      logger.warn({
        action: "auth_google_signin_error",
        message: `Erro no login com Google: ${error.message}`,
        data: { error }
      });
      
      set({ error: error.message });
      return { success: false, error: error.message };
    }

    logger.info({
      action: "auth_google_signin_initiated",
      message: "Login com Google iniciado com sucesso, redirecionando..."
    });

    return { success: true };
  } catch (error: any) {
    const errorMessage = error.message || "Erro ao iniciar login com Google";
    logger.error({
      action: "auth_google_signin_exception",
      message: errorMessage,
      data: { error, stack: error.stack }
    });
    
    set({ error: errorMessage });
    return { success: false, error: errorMessage };
  } finally {
    const duration = performance.now() - methodStart;
    
    logger.debug({
      action: "auth_google_signin_complete",
      message: `Processo de login com Google concluído em ${duration.toFixed(2)}ms`,
      data: { durationMs: duration }
    });
    
    set({ isLoading: false });
  }
};
