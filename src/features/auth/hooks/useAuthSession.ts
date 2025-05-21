
import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

/**
 * Hook para gerenciar e monitorar sessão de autenticação do Supabase
 */
export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const { refreshContext } = useAuthStore();

  // Verificar sessão atual
  const checkSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      return data.session;
    } catch (err: any) {
      logger.error({
        action: "check_session_error",
        message: `Erro ao verificar sessão: ${err.message}`,
        data: { error: err }
      });
      return null;
    }
  }, []);

  // Configurar listener de mudanças de autenticação
  useEffect(() => {
    logger.debug({
      action: "auth_session_init",
      message: "Inicializando monitoramento de sessão"
    });
    
    // Primeiro verificamos a sessão existente
    checkSession();
    
    // Então configuramos o listener para mudanças futuras
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      logger.debug({
        action: "auth_state_change",
        message: `Mudança de estado de autenticação: ${event}`,
        data: { event, hasSession: !!newSession }
      });
      
      setSession(newSession);
      
      // Agendamos a atualização do contexto para evitar problemas de concorrência
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setTimeout(() => {
          refreshContext().catch(err => {
            logger.error({
              action: "refresh_context_error",
              message: `Erro ao atualizar contexto: ${err.message}`,
              data: { error: err }
            });
          });
        }, 0);
      }
    });

    return () => {
      logger.debug({
        action: "auth_session_cleanup",
        message: "Removendo monitoramento de sessão"
      });
      subscription.unsubscribe();
    };
  }, [refreshContext, checkSession]);

  return {
    session,
    checkSession
  };
}
