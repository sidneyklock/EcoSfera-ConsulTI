import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from '@/types';
import { AuthStore, AuthState, AuthSignInResult, AuthSignUpResult, GoogleSignInResult } from '../types/auth.types';
import { logger } from '@/utils/logger';

const mapUserFromAuth = (authUser: any, userData?: any) => {
  return {
    id: authUser.id,
    email: authUser.email,
    name: userData?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
    avatar_url: authUser.user_metadata?.avatar_url,
    role: userData?.role || 'user' // Propriedade role adicionada
  };
};

const initialState: AuthState = {
  user: null,
  role: null,
  solutionId: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  clearError: () => {
    set({ error: null });
  },

  signIn: async (email, password): Promise<User | null> => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        logger.error({
          action: "auth_signin_error",
          message: `Erro no login: ${error.message}`,
          data: { error }
        });
        set({ error: error.message });
        return null;
      }

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
      set({ user: user as User, error: null });
      return user as User;

    } catch (error: any) {
      logger.error({
        action: "auth_signin_exception",
        message: error.message || "Erro ao realizar login",
        data: { error, stack: error.stack }
      });
      set({ error: error.message || "Erro ao realizar login" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, name): Promise<User | null> => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        logger.error({
          action: "auth_signup_error",
          message: `Erro no cadastro: ${error.message}`,
          data: { error }
        });
        set({ error: error.message });
        return null;
      }

      // Após o cadastro, insere os dados adicionais na tabela 'users'
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { id: data.user.id, full_name: name, email: email }
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

      const user = mapUserFromAuth(data.user, { full_name: name });
      set({ user: user as User, error: null });
      return user as User;

    } catch (error: any) {
      logger.error({
        action: "auth_signup_exception",
        message: error.message || "Erro ao realizar cadastro",
        data: { error, stack: error.stack }
      });
      set({ error: error.message || "Erro ao realizar cadastro" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async (): Promise<GoogleSignInResult> => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        logger.warn({
          action: "auth_google_signin_error",
          message: `Erro no login com Google: ${error.message}`,
          data: { error }
        });
        set({ error: error.message });
        return { success: false, error: error.message };
      }

      logger.info({
        action: "auth_google_signin_initiated",
        message: "Login com Google iniciado com sucesso, redirecionando...",
      });

      return { success: true };
    } catch (error: any) {
      logger.error({
        action: "auth_google_signin_exception",
        message: error.message || "Erro ao iniciar login com Google",
        data: { error, stack: error.stack }
      });
      set({ error: error.message || "Erro ao iniciar login com Google" });
      return { success: false, error: error.message || "Erro ao iniciar login com Google" };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await supabase.auth.signOut();
      set({ ...initialState });
    } catch (error: any) {
      logger.error({
        action: "auth_signout_exception",
        message: error.message || "Erro ao realizar logout",
        data: { error, stack: error.stack }
      });
      set({ error: error.message || "Erro ao realizar logout" });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshContext: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Busca os dados do usuário na tabela 'users'
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          logger.warn({
            action: "auth_refresh_user_fetch_error",
            message: `Erro ao buscar dados do usuário: ${userError.message}`,
            data: { userError }
          });
          set({ error: userError.message });
          return;
        }

        const user = mapUserFromAuth(session.user, userData);
        set({ user: user as User, error: null });
      } else {
        set({ user: null, role: null, solutionId: null });
      }
    } catch (error: any) {
      logger.error({
        action: "auth_refresh_exception",
        message: error.message || "Erro ao atualizar contexto do usuário",
        data: { error, stack: error.stack }
      });
      set({ error: error.message || "Erro ao atualizar contexto do usuário" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
