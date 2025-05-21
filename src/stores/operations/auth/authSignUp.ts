
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';
import { mapUserFromAuth } from './mappers';

/**
 * Registro com email e senha
 */
export const signUp = async (email: string, password: string, name: string | undefined, set: Function, get: Function) => {
  const methodStart = performance.now();
  try {
    set({ isLoading: true, error: null });
    
    logger.debug({
      action: "auth_signup_start",
      message: `Iniciando processo de registro para ${email}`,
      data: { email, hasName: !!name }
    });
    
    const { data, error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
    
    if (signUpError) {
      logger.warn({
        action: "auth_signup_error",
        message: `Erro no registro: ${signUpError.message}`,
        data: { error: signUpError, email }
      });
      
      set({ error: signUpError.message });
      toast.error(signUpError.message);
      return null;
    }

    // Após o cadastro, insere os dados adicionais na tabela 'users'
    const { error: userError } = await supabase
      .from('users')
      .insert([
        { id: data.user?.id, full_name: name, email: email }
      ]);

    if (userError) {
      logger.warn({
        action: "auth_signup_user_insert_error",
        message: `Erro ao inserir dados do usuário: ${userError.message}`,
        data: { userError }
      });
      set({ error: userError.message });
      return null;
    }
    
    const user = data.user ? mapUserFromAuth(data.user, { full_name: name }) : null;
    
    if (user) {
      logger.info({
        userId: user.id,
        action: "auth_signup_success",
        message: "Registro bem-sucedido",
        data: { email: user.email }
      });
      
      toast.success("Registro realizado com sucesso!");
      set({ user, error: null });
    }
    
    return user;
  } catch (error: any) {
    const errorMessage = error.message || "Erro ao registrar usuário";
    logger.error({
      action: "auth_signup_exception",
      message: errorMessage,
      data: { error, email, stack: error.stack }
    });
    
    set({ error: errorMessage });
    toast.error(errorMessage);
    return null;
  } finally {
    const duration = performance.now() - methodStart;
    
    logger.debug({
      action: "auth_signup_complete",
      message: `Processo de registro concluído em ${duration.toFixed(2)}ms`,
      data: { durationMs: duration, email }
    });
    
    set({ isLoading: false });
  }
};
