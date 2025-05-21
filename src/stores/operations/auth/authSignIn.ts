
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';
import { createUserRecord } from '../userOperations';

/**
 * Login com email e senha
 */
export const signIn = async (email: string, password: string, set: Function, get: Function) => {
  const methodStart = performance.now();
  try {
    set({ isLoading: true, error: null });
    
    logger.debug({
      action: "auth_signin_start",
      message: `Iniciando processo de login para ${email}`,
      data: { email }
    });
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (signInError) {
      logger.warn({
        action: "auth_signin_error",
        message: `Erro no login: ${signInError.message}`,
        data: { error: signInError, email }
      });
      
      set({ error: signInError.message });
      return null;
    }
    
    const mappedUser = data.user ? {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
      avatar_url: data.user.user_metadata?.avatar_url,
    } : null;
    
    if (mappedUser) {
      logger.info({
        userId: mappedUser.id,
        action: "auth_signin_success",
        message: "Login bem-sucedido, criando registro de usuário",
        data: { email: mappedUser.email }
      });
      
      await createUserRecord(data.user);
      await get().refreshContext();
      toast.success("Login realizado com sucesso!");
    }
    
    return mappedUser;
  } catch (error: any) {
    const errorMessage = error.message || "Erro ao realizar login";
    logger.error({
      action: "auth_signin_exception",
      message: errorMessage,
      data: { error, email, stack: error.stack }
    });
    
    set({ error: errorMessage });
    toast.error(errorMessage);
    return null;
  } finally {
    const duration = performance.now() - methodStart;
    
    logger.debug({
      action: "auth_signin_complete",
      message: `Processo de login concluído em ${duration.toFixed(2)}ms`,
      data: { durationMs: duration, email }
    });
    
    set({ isLoading: false });
  }
};
