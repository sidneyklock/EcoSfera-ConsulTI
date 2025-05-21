
import { useState, useCallback } from 'react';
import { User } from "@/types";
import { supabase } from '@/integrations/supabase/client';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

/**
 * Hook que centraliza a lógica de autenticação da aplicação
 * Consolida funcionalidades dos hooks useAuth e useAuthentication
 */
export function useAuthService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { 
    createUserRecord, 
    fetchUserContext,
    user,
    role,
    solutionId
  } = useSecureContextStore();

  /**
   * Realiza login com e-mail e senha
   * @param email E-mail do usuário
   * @param password Senha do usuário
   */
  const signIn = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
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
        await createUserRecord(data.user);
        await fetchUserContext();
        toast.success("Login realizado com sucesso!");
        setTimeout(() => navigate("/dashboard"), 0);
      }
      
      return mappedUser;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao realizar login";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [createUserRecord, fetchUserContext, navigate]);

  /**
   * Realiza login com Google
   */
  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (googleError) {
        setError(googleError.message);
        toast.error(googleError.message);
        return { success: false };
      }
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao iniciar login com Google";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false };
    } finally {
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
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (signUpError) {
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
        toast.success("Registro realizado com sucesso!");
        navigate("/verify-email", { state: { email } });
      }
      
      return user;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao registrar usuário";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Realiza logout do usuário
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao realizar logout";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

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
