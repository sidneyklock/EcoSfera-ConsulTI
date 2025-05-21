
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { logger } from '@/utils/logger';
import { toast } from '@/components/ui/sonner';
import { createUserRecord } from './userOperations';

/**
 * Operations relacionadas à autenticação
 */
export const authOperations = {
  /**
   * Limpar mensagens de erro
   */
  clearError: (set: Function) => {
    set({ error: null });
  },

  /**
   * Login com email e senha
   */
  signIn: async (email: string, password: string, set: Function, get: Function) => {
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
  },

  /**
   * Registro com email e senha
   */
  signUp: async (email: string, password: string, name: string | undefined, set: Function, get: Function) => {
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
  },

  /**
   * Login com Google
   */
  signInWithGoogle: async (set: Function) => {
    const methodStart = performance.now();
    try {
      set({ isLoading: true, error: null });
      
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
        
        set({ error: googleError.message });
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
      
      set({ error: errorMessage });
      toast.error(errorMessage);
      return { success: false };
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        action: "auth_google_complete",
        message: `Processo de login com Google concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration }
      });
      
      set({ isLoading: false });
    }
  },

  /**
   * Logout
   */
  signOut: async (set: Function, get: Function) => {
    const methodStart = performance.now();
    const state = get();
    const user = state.user;
    try {
      set({ isLoading: true, error: null });
      
      logger.debug({
        userId: user?.id,
        action: "auth_signout_start",
        message: "Iniciando processo de logout"
      });
      
      await supabase.auth.signOut();
      set({ user: null, role: null, solutionId: null });
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
      
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      const duration = performance.now() - methodStart;
      
      logger.debug({
        userId: user?.id,
        action: "auth_signout_complete",
        message: `Processo de logout concluído em ${duration.toFixed(2)}ms`,
        data: { durationMs: duration }
      });
      
      set({ isLoading: false });
    }
  },

  /**
   * Atualizar contexto do usuário
   */
  refreshContext: async (set: Function) => {
    try {
      set({ isLoading: true, error: null });
      
      // Obter sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, role: null, solutionId: null });
        return;
      }
      
      // Obter perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        set({ error: profileError.message });
        return;
      }
      
      // Mapear usuário
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
        avatar_url: session.user.user_metadata?.avatar_url,
      };
      
      // Obter papel do usuário
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role_id, solution_id')
        .eq('user_id', user.id)
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') { // Ignora erro "não encontrado"
        set({ error: roleError.message });
        return;
      }
      
      // Obter nome do papel
      let role = null;
      if (userRole?.role_id) {
        const { data: roleData } = await supabase
          .from('roles')
          .select('name')
          .eq('id', userRole.role_id)
          .single();
        
        if (roleData) {
          role = roleData.name;
        }
      }
      
      set({ 
        user, 
        role, 
        solutionId: userRole?.solution_id || null 
      });
    } catch (error: any) {
      set({ error: error.message || "Erro ao atualizar contexto do usuário" });
    } finally {
      set({ isLoading: false });
    }
  }
};
