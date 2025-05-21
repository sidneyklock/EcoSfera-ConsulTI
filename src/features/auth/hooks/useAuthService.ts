
import { useState, useCallback, useEffect } from 'react';
import { User } from "@/types";
import { supabase } from '@/integrations/supabase/client';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { logger } from "@/utils/logger";

/**
 * Hook consolidated que centraliza toda a lógica de autenticação da aplicação
 * Substitui os hooks useAuth, useAuthentication e useSecureContext
 */
export function useAuthService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const startTime = performance.now();

  const { 
    createUserRecord, 
    fetchUserContext,
    user,
    role,
    solutionId
  } = useSecureContextStore();

  // Log performance metrics for hook initialization
  useEffect(() => {
    logger.debug({
      userId: user?.id,
      action: "hook_initialized",
      message: `useAuthService initialized in ${(performance.now() - startTime).toFixed(2)}ms`,
      data: { timeMs: performance.now() - startTime }
    });

    return () => {
      logger.debug({
        userId: user?.id,
        action: "hook_cleanup",
        message: `useAuthService cleanup after ${(performance.now() - startTime).toFixed(2)}ms`,
        data: { timeMs: performance.now() - startTime, hasUser: !!user }
      });
    };
  }, [user?.id, startTime]);

  /**
   * Realiza login com e-mail e senha
   * @param email E-mail do usuário
   * @param password Senha do usuário
   */
  const signIn = useCallback(async (email: string, password: string): Promise<User | null> => {
    const methodStart = performance.now();
    try {
      setIsLoading(true);
      setError(null);
      
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
        
        setError(signInError.message);
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
        await fetchUserContext();
        toast.success("Login realizado com sucesso!");
        setTimeout(() => navigate("/dashboard"), 0);
      }
      
      return mappedUser;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao realizar login";
      logger.error({
        action: "auth_signin_exception",
        message: errorMessage,
        data: { error, email, stack: error.stack }
      });
      
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        action: "auth_signin_complete",
        message: `Processo de login concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration, email }
      });
      
      setIsLoading(false);
    }
  }, [createUserRecord, fetchUserContext, navigate]);

  /**
   * Realiza login com Google
   */
  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean }> => {
    const methodStart = performance.now();
    try {
      setIsLoading(true);
      setError(null);
      
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
        
        setError(googleError.message);
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
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false };
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        action: "auth_google_complete",
        message: `Processo de login com Google concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration }
      });
      
      setIsLoading(false);
    }
  }, []);

  /**
   * Registra um novo usuário
   * @param email E-mail do usuário
   * @param password Senha do usuário
   * @param name Nome do usuário (opcional)
   */
  const signUp = useCallback(async (email: string, password: string, name?: string): Promise<User | null> => {
    const methodStart = performance.now();
    try {
      setIsLoading(true);
      setError(null);
      
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
        
        setError(signUpError.message);
        toast.error(signUpError.message);
        return null;
      }

      const user = data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
        avatar_url: data.user.user_metadata?.avatar_url,
      } : null;
      
      if (user) {
        logger.info({
          userId: user.id,
          action: "auth_signup_success",
          message: "Registro bem-sucedido",
          data: { email: user.email }
        });
        
        toast.success("Registro realizado com sucesso!");
        navigate("/verify-email", { state: { email } });
      }
      
      return user;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao registrar usuário";
      logger.error({
        action: "auth_signup_exception",
        message: errorMessage,
        data: { error, email, stack: error.stack }
      });
      
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        action: "auth_signup_complete",
        message: `Processo de registro concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration, email }
      });
      
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Realiza logout do usuário
   */
  const signOut = useCallback(async (): Promise<void> => {
    const methodStart = performance.now();
    try {
      setIsLoading(true);
      setError(null);
      
      logger.debug({
        userId: user?.id,
        action: "auth_signout_start",
        message: "Iniciando processo de logout"
      });
      
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logout realizado com sucesso");
      
      logger.info({
        userId: user?.id,
        action: "auth_signout_success",
        message: "Logout realizado com sucesso"
      });
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao realizar logout";
      logger.error({
        userId: user?.id,
        action: "auth_signout_exception",
        message: errorMessage,
        data: { error, stack: error.stack }
      });
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        userId: user?.id,
        action: "auth_signout_complete",
        message: `Processo de logout concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration }
      });
      
      setIsLoading(false);
    }
  }, [navigate, user?.id]);

  return {
    user,
    role,
    solutionId,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshContext: fetchUserContext
  };
}
