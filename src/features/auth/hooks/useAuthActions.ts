
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

/**
 * Hook que fornece ações básicas de autenticação (login, registro, logout)
 */
export function useAuthActions() {
  const navigate = useNavigate();
  
  // Obter ações da store
  const { 
    signIn: storeSignIn,
    signUp: storeSignUp,
    signInWithGoogle: storeSignInWithGoogle,
    signOut: storeSignOut
  } = useAuthStore();

  // Login com email e senha (com navegação)
  const signIn = useCallback(async (email: string, password: string) => {
    logger.debug({
      action: "sign_in_attempt",
      message: "Tentativa de login com email",
      data: { email }
    });
    
    const user = await storeSignIn(email, password);
    if (user) {
      navigate('/dashboard');
    }
    return user;
  }, [storeSignIn, navigate]);

  // Registro com email e senha (com navegação)
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    logger.debug({
      action: "sign_up_attempt",
      message: "Tentativa de registro com email",
      data: { email, hasName: !!name }
    });
    
    const user = await storeSignUp(email, password, name);
    if (user) {
      navigate('/verify-email', { state: { email } });
    }
    return user;
  }, [storeSignUp, navigate]);

  // Logout (com navegação)
  const signOut = useCallback(async () => {
    logger.debug({
      action: "sign_out_attempt",
      message: "Tentativa de logout"
    });
    
    await storeSignOut();
    navigate('/login');
  }, [storeSignOut, navigate]);

  // Login com Google
  const signInWithGoogle = useCallback(async () => {
    logger.debug({
      action: "google_sign_in_attempt",
      message: "Tentativa de login com Google"
    });
    
    return storeSignInWithGoogle();
  }, [storeSignInWithGoogle]);

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };
}
