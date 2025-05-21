
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';
import { createUserRecord } from '../userOperations';
import { mapUserFromAuth } from './mappers';

/**
 * Login with email and password
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
    
    // Busca os dados do usuário na tabela 'users'
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      logger.warn({
        action: "auth_signin_user_fetch_error",
        message: `Erro ao buscar dados do usuário: ${userError.message}`,
        data: { userError }
      });
      set({ error: userError.message });
      return null;
    }
    
    const user = mapUserFromAuth(data.user, userData);
    
    if (user) {
      logger.info({
        userId: user.id,
        action: "auth_signin_success",
        message: "Login bem-sucedido",
        data: { email: user.email }
      });
      
      await createUserRecord(data.user);
      toast.success("Login realizado com sucesso!");
    }
    
    set({ user, error: null });
    return user;
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
