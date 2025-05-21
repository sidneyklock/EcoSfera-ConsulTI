
import { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { useAuthentication, AuthenticationState } from "@/hooks/useAuthentication";

/**
 * Interface do contexto de autenticação
 */
type AuthContextType = {
  authState: AuthenticationState;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, name?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean }>;
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider para o contexto de autenticação
 * Usa o hook useAuthentication para gerenciar o estado
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    authState, 
    signIn: authenticateUser, 
    signUp: registerUser, 
    signOut: logoutUser, 
    signInWithGoogle: googleAuth,
    LoadingSpinner
  } = useAuthentication();

  const navigate = useNavigate();

  /**
   * Função de login com redirecionamento
   */
  const signIn = async (email: string, password: string) => {
    const user = await authenticateUser(email, password);
    if (user) {
      // Após login bem-sucedido, redirecionar para o dashboard
      setTimeout(() => navigate("/dashboard"), 0);
    }
    return user;
  };

  /**
   * Função de registro com redirecionamento
   */
  const signUp = async (email: string, password: string, name?: string) => {
    const user = await registerUser(email, password, name);
    if (user) {
      // Após registro bem-sucedido, redirecionar para verificação de email
      navigate("/verify-email", { state: { email } });
    }
    return user;
  };

  /**
   * Função de logout com redirecionamento
   */
  const signOut = async () => {
    await logoutUser();
    navigate("/login");
  };

  const value: AuthContextType = {
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle: googleAuth,
  };

  if (authState.isLoading) {
    return <LoadingSpinner />;
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
