
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { useAuthService } from "@/features/auth/hooks";
import { logger } from "@/utils/logger";
import { fetchLogger } from "@/utils/fetchLogger";
import { dispatchAuthStateChange } from "@/utils/events";
import { toast } from "@/components/ui/sonner";
import { GoogleSignInResult } from "@/stores/types/auth.types";

/**
 * Interface do contexto de autenticação
 */
type AuthContextType = {
  authState: {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    role: string | null;
    solutionId: string | null;
    session: any | null;
  };
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, name?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<GoogleSignInResult>;
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider para o contexto de autenticação
 * Usa o hook useAuthService para gerenciar o estado
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    role,
    solutionId,
    isLoading,
    error,
    signIn: authenticateUser,
    signUp: registerUser,
    signOut: logoutUser,
    signInWithGoogle: googleAuth,
  } = useAuthService();

  const navigate = useNavigate();

  // Monitor auth state changes and dispatch events
  useEffect(() => {
    const authState = { user, role, isLoading, error };
    
    // Dispatch auth state change event for tracking
    dispatchAuthStateChange(authState, user);
    
    // Log significant auth state changes
    if (user && !isLoading) {
      logger.info({
        userId: user.id,
        action: "auth_state_changed",
        message: "User authenticated",
        data: { role }
      });
    } else if (!user && !isLoading && error) {
      logger.warn({
        action: "auth_state_changed",
        message: "Authentication error",
        data: { error }
      });
    }
  }, [user, role, isLoading, error]);

  /**
   * Função de login com redirecionamento e instrumentação
   */
  const signIn = async (email: string, password: string) => {
    return await fetchLogger.withLogs(
      "user_login",
      async () => {
        const user = await authenticateUser(email, password);
        if (user) {
          toast.success("Login realizado com sucesso!");
        }
        return user;
      },
      undefined, // user not available yet
      "Iniciando processo de login",
      (user) => `Login ${user ? 'bem-sucedido' : 'falhou'} para ${email}`,
      "Erro ao processar login"
    );
  };

  /**
   * Função de registro com redirecionamento e instrumentação
   */
  const signUp = async (email: string, password: string, name?: string) => {
    return await fetchLogger.withLogs(
      "user_signup",
      async () => {
        const user = await registerUser(email, password, name);
        if (user) {
          toast.success("Registro realizado com sucesso!");
        }
        return user;
      },
      undefined, // user not available yet
      "Iniciando processo de registro",
      (user) => `Registro ${user ? 'bem-sucedido' : 'falhou'} para ${email}`,
      "Erro ao processar registro"
    );
  };

  /**
   * Função de logout com redirecionamento e instrumentação
   */
  const signOut = async () => {
    return await fetchLogger.withLogs(
      "user_logout",
      async () => {
        await logoutUser();
        toast.success("Logout realizado com sucesso");
      },
      user,
      "Iniciando processo de logout",
      () => "Logout realizado com sucesso",
      "Erro ao processar logout"
    );
  };

  /**
   * Função para login com Google
   */
  const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
    try {
      return await googleAuth();
    } catch (error) {
      logger.error({
        action: "google_auth_error",
        message: "Erro durante autenticação com Google",
        data: { error }
      });
      return { success: false, error: "Erro ao autenticar com Google" };
    }
  };

  // Mantendo compatibilidade com a interface existente
  const authState = {
    user,
    isLoading,
    error,
    role,
    solutionId,
    session: null // Mantido para compatibilidade, embora não estejamos mais usando diretamente
  };

  const value: AuthContextType = {
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  if (isLoading) {
    logger.debug({
      action: "auth_provider_loading",
      message: "AuthProvider in loading state"
    });
    
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 * @returns {AuthContextType} Contexto de autenticação
 * @throws {Error} Se usado fora de um AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    const error = new Error("useAuth must be used within an AuthProvider");
    logger.error({
      action: "context_error",
      message: "useAuth called outside AuthProvider",
      data: { stack: error.stack }
    });
    throw error;
  }
  return context;
}
