
import { User } from '@/types';

/**
 * Níveis de log suportados pelo sistema
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Tipo de entrada para o sistema de log
 */
export interface LogEntry {
  /** ID do usuário (opcional) */
  userId?: string;
  /** Ação sendo executada (ex: "load_dashboard") */
  action: string;
  /** Mensagem personalizada */
  message: string;
  /** Dados adicionais para serem logados */
  data?: any;
  /** Status da operação */
  status: 'success' | 'fail';
}

/**
 * Determina se o nível de log atual deve ser exibido
 * com base em configurações do ambiente
 */
const shouldLog = (level: LogLevel): boolean => {
  // Em produção, podemos filtrar logs de debug
  if (import.meta.env.PROD && level === LogLevel.DEBUG) {
    return false;
  }
  return true;
};

/**
 * Formata uma entrada de log para texto
 */
const formatLogEntry = (entry: LogEntry, level: LogLevel): string => {
  const timestamp = new Date().toISOString();
  const userPart = entry.userId ? `[User: ${entry.userId}]` : '[Anonymous]';
  
  return `${timestamp} ${level.toUpperCase()} ${userPart} [${entry.action}] [${entry.status}] ${entry.message}`;
};

/**
 * Exibe um log com o nível e entrada especificados
 */
const logWithLevel = (level: LogLevel, entry: LogEntry): void => {
  if (!shouldLog(level)) return;
  
  const formattedMessage = formatLogEntry(entry, level);
  const methodMap = {
    [LogLevel.DEBUG]: console.debug,
    [LogLevel.INFO]: console.info,
    [LogLevel.WARN]: console.warn,
    [LogLevel.ERROR]: console.error
  };

  const logMethod = methodMap[level];
  
  // Use console.groupCollapsed para organizar os logs
  console.groupCollapsed(formattedMessage);
  
  // Detalhes adicionais dentro do grupo
  if (entry.data) {
    console.log('Detalhes:', entry.data);
  }
  
  // Em ambiente de desenvolvimento, adicionar stack trace para erros
  if (level === LogLevel.ERROR && !import.meta.env.PROD) {
    console.trace('Stack trace:');
  }
  
  console.groupEnd();
  
  // Aqui poderia ser adicionada integração com serviços externos como Sentry
  // Exemplo: if (level === LogLevel.ERROR) Sentry.captureException(entry);
};

/**
 * Interface principal do logger
 */
export const logger = {
  /**
   * Registra uma informação
   */
  info: (entry: Omit<LogEntry, 'status'> & { status?: 'success' | 'fail' }): void => {
    logWithLevel(LogLevel.INFO, { ...entry, status: entry.status || 'success' });
  },
  
  /**
   * Registra um aviso
   */
  warn: (entry: Omit<LogEntry, 'status'> & { status?: 'success' | 'fail' }): void => {
    logWithLevel(LogLevel.WARN, { ...entry, status: entry.status || 'fail' });
  },
  
  /**
   * Registra um erro
   */
  error: (entry: Omit<LogEntry, 'status'> & { status?: 'success' | 'fail' }, error?: Error): void => {
    const entryWithError = { 
      ...entry, 
      status: entry.status || 'fail',
      data: { ...(entry.data || {}), error: error?.message || 'Erro desconhecido', stack: error?.stack }
    };
    logWithLevel(LogLevel.ERROR, entryWithError);
    
    // Preparado para integração futura com Sentry
    // if (Sentry) Sentry.captureException(error);
  },
  
  /**
   * Registra informações de debug 
   * (apenas exibido em ambiente de desenvolvimento)
   */
  debug: (entry: Omit<LogEntry, 'status'> & { status?: 'success' | 'fail' }): void => {
    logWithLevel(LogLevel.DEBUG, { ...entry, status: entry.status || 'success' });
  },
  
  /**
   * Helper para logs de ações do usuário
   */
  userAction: (user: User | null, action: string, message: string, status: 'success' | 'fail' = 'success', data?: any): void => {
    logWithLevel(LogLevel.INFO, {
      userId: user?.id,
      action,
      message,
      status,
      data
    });
  }
};

/**
 * Hook para facilitar o uso do logger em componentes React
 */
export const useLogger = (componentName: string, user?: User | null) => {
  return {
    info: (action: string, message: string, data?: any) => {
      logger.info({
        userId: user?.id,
        action: `${componentName}:${action}`,
        message,
        data
      });
    },
    warn: (action: string, message: string, data?: any) => {
      logger.warn({
        userId: user?.id,
        action: `${componentName}:${action}`,
        message,
        data
      });
    },
    error: (action: string, message: string, error?: Error, data?: any) => {
      logger.error({
        userId: user?.id,
        action: `${componentName}:${action}`,
        message,
        data
      }, error);
    },
    debug: (action: string, message: string, data?: any) => {
      logger.debug({
        userId: user?.id,
        action: `${componentName}:${action}`,
        message,
        data
      });
    },
  };
};

export default logger;
