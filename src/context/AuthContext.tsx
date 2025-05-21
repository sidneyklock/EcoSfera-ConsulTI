
import { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { useAuthService } from "@/features/auth/hooks";

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
  signInWithGoogle: () => Promise<{ success: boolean }>;
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

  /**
   * Função de login com redirecionamento
   */
  const signIn = async (email: string, password: string) => {
    const user = await authenticateUser(email, password);
    // Não é mais necessário redirecionar aqui pois isso já é feito no hook useAuthService
    return user;
  };

  /**
   * Função de registro com redirecionamento
   */
  const signUp = async (email: string, password: string, name?: string) => {
    const user = await registerUser(email, password, name);
    // Não é mais necessário redirecionar aqui pois isso já é feito no hook useAuthService
    return user;
  };

  /**
   * Função de logout com redirecionamento
   */
  const signOut = async () => {
    await logoutUser();
    // Não é mais necessário redirecionar aqui pois isso já é feito no hook useAuthService
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
    signInWithGoogle: googleAuth,
  };

  if (isLoading) {
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
