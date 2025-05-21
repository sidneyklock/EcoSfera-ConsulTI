
import { toast } from '@/components/ui/sonner';
import { logger } from '@/utils/logger';

/**
 * Limpar mensagens de erro
 */
export const clearError = (set: Function) => {
  set({ error: null });
};

/**
 * Processar e formatar erros de autenticação
 * @param error Erro original
 * @param defaultMessage Mensagem padrão em caso de erro não reconhecido
 * @returns Mensagem de erro formatada
 */
export const formatAuthError = (error: any, defaultMessage: string = "Erro de autenticação") => {
  if (!error) return defaultMessage;
  
  // Erros conhecidos do Supabase Auth
  if (typeof error === 'object' && error.message) {
    // Melhor tratamento para mensagens de erro específicas
    if (error.message.includes("Email not confirmed")) {
      return "Email não confirmado. Por favor, verifique sua caixa de entrada.";
    }
    
    if (error.message.includes("Invalid login credentials")) {
      return "Credenciais inválidas. Verifique seu email e senha.";
    }
    
    if (error.message.includes("Email already registered")) {
      return "Este email já está registrado. Tente fazer login.";
    }
    
    if (error.message.includes("Password should be")) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    
    return error.message;
  }
  
  return defaultMessage;
};

/**
 * Exibir erro de autenticação no toast e no log
 * @param error Erro ocorrido
 * @param action Ação que gerou o erro
 * @param userId ID do usuário (opcional)
 */
export const handleAuthError = (error: any, action: string, userId?: string) => {
  const errorMessage = formatAuthError(error);
  
  // Log do erro
  logger.error({
    userId,
    action: `auth_${action}_error`,
    message: errorMessage,
    data: { error, stack: error.stack }
  });
  
  // Feedback visual
  toast.error(errorMessage);
  
  return errorMessage;
};

/**
 * Exibir mensagem de sucesso de autenticação
 * @param message Mensagem de sucesso
 * @param action Ação realizada
 * @param userId ID do usuário (opcional)
 */
export const handleAuthSuccess = (message: string, action: string, userId?: string) => {
  // Log do sucesso
  logger.info({
    userId,
    action: `auth_${action}_success`,
    message
  });
  
  // Feedback visual
  toast.success(message);
};
