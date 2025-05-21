
import { logger } from './logger';
import { User } from '@/types';
import { dispatchSupabaseQueryError } from './events';

/**
 * Função auxiliar para logs em operações de fetch
 */
export const fetchLogger = {
  /**
   * Loga o início de uma operação de busca
   */
  start: (operation: string, message: string, user?: User | null, additionalData?: any) => {
    logger.info({
      userId: user?.id,
      action: `${operation}_start`,
      message,
      data: additionalData,
      status: 'success'
    });
  },
  
  /**
   * Loga o sucesso de uma operação de busca
   */
  success: (operation: string, message: string, additionalData?: any, user?: User | null) => {
    logger.info({
      userId: user?.id,
      action: `${operation}_success`,
      message,
      data: additionalData,
      status: 'success'
    });
  },
  
  /**
   * Loga um erro em uma operação de busca
   */
  error: (operation: string, message: string, error: unknown, additionalData?: any, user?: User | null) => {
    logger.error({
      userId: user?.id,
      action: `${operation}_error`,
      message,
      data: { ...additionalData, error },
      status: 'fail'
    }, error instanceof Error ? error : undefined);
    
    // Disparar evento de erro do Supabase
    dispatchSupabaseQueryError(
      operation,
      message,
      additionalData?.table,
      additionalData?.errorCode,
      { 
        ...additionalData, 
        errorDetails: error instanceof Error ? error.message : String(error) 
      },
      user
    );
  },

  /**
   * Wrapper para executar uma função de fetch com logs automáticos
   * @param operation Nome da operação (ex: "fetch_users")
   * @param fetchFn Função assíncrona que realiza o fetch
   * @param user Usuário atual (opcional)
   * @param startMessage Mensagem para o log de início (opcional)
   * @param successMessage Função que recebe o resultado e retorna a mensagem de sucesso (opcional)
   * @param errorMessage Mensagem para o log de erro (opcional)
   * @returns Resultado da função fetchFn
   */
  withLogs: async <T>(
    operation: string,
    fetchFn: () => Promise<T>,
    user?: User | null,
    startMessage: string = `Iniciando ${operation}`,
    successMessage: (result: T) => string = () => `${operation} concluído com sucesso`,
    errorMessage: string = `Erro ao executar ${operation}`
  ): Promise<T> => {
    fetchLogger.start(operation, startMessage, user);
    
    try {
      const result = await fetchFn();
      fetchLogger.success(operation, successMessage(result), { result }, user);
      return result;
    } catch (error) {
      fetchLogger.error(operation, errorMessage, error, {}, user);
      throw error;
    }
  }
};

/**
 * Hook para criar um logger de fetch com contexto do usuário
 */
export const createFetchLogger = (user?: User | null) => {
  return {
    start: (operation: string, message: string, additionalData?: any) => 
      fetchLogger.start(operation, message, user, additionalData),
      
    success: (operation: string, message: string, additionalData?: any) => 
      fetchLogger.success(operation, message, additionalData, user),
      
    error: (operation: string, message: string, error: unknown, additionalData?: any) => 
      fetchLogger.error(operation, message, error, additionalData, user),
      
    withLogs: <T>(
      operation: string,
      fetchFn: () => Promise<T>,
      startMessage?: string,
      successMessage?: (result: T) => string,
      errorMessage?: string
    ) => fetchLogger.withLogs(operation, fetchFn, user, startMessage, successMessage, errorMessage)
  };
};

/**
 * Hook para criar um wrapper de operação fetch com logs
 * Exemplo de uso:
 * 
 * const fetchWithLogs = useFetchWithLogs();
 * const data = await fetchWithLogs(
 *   "get_user_profile",
 *   () => supabase.from('profiles').select('*').eq('user_id', userId).single(),
 *   "Buscando perfil do usuário",
 *   (result) => `Perfil do usuário carregado: ${result.data?.name}`,
 *   "Erro ao carregar perfil do usuário"
 * );
 */
export const useFetchWithLogs = (user?: User | null) => {
  return <T>(
    operation: string,
    fetchFn: () => Promise<T>,
    startMessage?: string,
    successMessage?: (result: T) => string,
    errorMessage?: string
  ) => fetchLogger.withLogs(operation, fetchFn, user, startMessage, successMessage, errorMessage);
};

export default fetchLogger;
