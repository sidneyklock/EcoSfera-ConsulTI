
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { logger } from "@/utils/logger";

/**
 * Hook consolidado que centraliza toda a lógica de autenticação da aplicação
 * Substitui os hooks useAuth, useAuthentication e useSecureContext
 */
export function useAuthService() {
  const navigate = useNavigate();
  
  // Obter estado e ações da store
  const { 
    user, 
    role, 
    solutionId, 
    isLoading, 
    error,
    signIn: storeSignIn,
    signUp: storeSignUp,
    signInWithGoogle: storeSignInWithGoogle,
    signOut: storeSignOut,
    refreshContext
  } = useAuthStore();

  // Login com email e senha (com navegação)
  const signIn = useCallback(async (email: string, password: string) => {
    const user = await storeSignIn(email, password);
    if (user) {
      navigate('/dashboard');
    }
    return user;
  }, [storeSignIn, navigate]);

  // Registro com email e senha (com navegação)
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const user = await storeSignUp(email, password, name);
    if (user) {
      navigate('/verify-email', { state: { email } });
    }
    return user;
  }, [storeSignUp, navigate]);

  // Logout (com navegação)
  const signOut = useCallback(async () => {
    await storeSignOut();
    navigate('/login');
  }, [storeSignOut, navigate]);

  // Métodos sem navegação (para compatibilidade com componentes existentes)
  const signInWithGoogle = useCallback(async () => {
    return storeSignInWithGoogle();
  }, [storeSignInWithGoogle]);

  // Inicialização do hook para métricas
  logger.debug({
    userId: user?.id,
    action: "hook_initialized",
    message: "useAuthService hook initialized",
    data: { hasUser: !!user }
  });

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
    refreshContext
  };
}
