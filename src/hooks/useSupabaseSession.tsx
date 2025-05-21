
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { getErrorMessage } from "@/services/authService";
import { logger, fetchLogger } from "@/utils";

/**
 * Hook para gerenciar a sessão do Supabase de forma eficiente
 * 
 * @returns {Object} Objeto contendo a sessão, usuário, status de carregamento e erro
 */
export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para mapear dados do usuário Supabase para o formato da aplicação
    const mapUserData = (supabaseUser: any): User => {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        role: supabaseUser.user_metadata?.role || 'user'
      };
    };

    // Primeiro, configurar o listener para mudanças de estado de autenticação
    // para garantir que não percamos eventos durante a inicialização
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, sessionUpdate) => {
        setSession(sessionUpdate);
        setUser(sessionUpdate?.user ? mapUserData(sessionUpdate.user) : null);
        setLoading(false);
        setError(null);
      }
    );

    // Depois, verificar a sessão atual
    const checkSession = async () => {
      try {
        setLoading(true);
        
        fetchLogger.start("auth_session", "Verificando sessão do usuário");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          fetchLogger.error("auth_session", "Erro ao verificar sessão", error);
          throw error;
        }

        setSession(data.session);
        
        const mappedUser = data.session?.user ? mapUserData(data.session.user) : null;
        setUser(mappedUser);
        
        fetchLogger.success(
          "auth_session", 
          "Sessão verificada com sucesso", 
          { authenticated: !!data.session, userInfo: mappedUser ? { id: mappedUser.id, email: mappedUser.email } : null }
        );
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
        const errorMessage = getErrorMessage(err as any);
        setError(errorMessage);
        
        fetchLogger.error(
          "auth_session", 
          "Erro ao verificar sessão", 
          err, 
          { errorDetails: errorMessage }
        );
      } finally {
        setLoading(false);
      }
    };

    // Iniciar a verificação da sessão
    checkSession();

    // Cleanup: remover o listener quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas na montagem do componente

  return { session, user, loading, error };
};
