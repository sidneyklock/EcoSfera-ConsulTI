
import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "../types";
import { toast } from "@/components/ui/sonner";
import {
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
  signInWithGoogle as signInWithGoogleService,
  signOut as signOutService,
  getCurrentSession,
  setupAuthListener
} from "@/services/authService";

interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Verificar sessão existente e configurar listener para mudanças de autenticação
  useEffect(() => {
    // Primeiro, configuramos o listener para mudanças de autenticação
    const subscription = setupAuthListener((user) => {
      setAuthState({ 
        user, 
        isLoading: false, 
        error: null 
      });
    });

    // Depois, verificamos se já existe uma sessão ativa
    const checkSession = async () => {
      try {
        const { user, error } = await getCurrentSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
        }
        
        setAuthState({ 
          user, 
          isLoading: false, 
          error: null 
        });
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setAuthState({ 
          user: null, 
          isLoading: false, 
          error: null 
        });
      }
    };
    
    checkSession();
    
    // Cleanup: remover o listener quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { user, error } = await signInWithEmailAndPassword(email, password);
      
      if (error) {
        toast.error(error);
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
        return;
      }
      
      if (user) {
        toast.success("Login realizado com sucesso!");
        setAuthState({ 
          user, 
          isLoading: false, 
          error: null 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha no login. Por favor, tente novamente.";
      toast.error(errorMessage);
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { user, error } = await signUpWithEmailAndPassword(email, password, name);
      
      if (error) {
        toast.error(error);
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
        return;
      }
      
      if (user) {
        toast.success("Cadastro realizado com sucesso!");
        setAuthState({ 
          user, 
          isLoading: false, 
          error: null 
        });
      } else {
        toast.success("Cadastro realizado! Por favor, verifique seu e-mail para confirmar sua conta.");
        setAuthState({ 
          user: null, 
          isLoading: false, 
          error: null 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha no registro. Por favor, tente novamente.";
      toast.error(errorMessage);
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await signInWithGoogleService();
      
      if (error) {
        toast.error(error);
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
      }
      // Não definimos o usuário aqui, pois o Google OAuth redireciona para outra página
      // O listener de autenticação configurado no useEffect irá atualizar o estado quando
      // o usuário retornar após autenticação bem-sucedida
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha no login com Google. Por favor, tente novamente.";
      toast.error(errorMessage);
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await signOutService();
      
      if (error) {
        toast.error(error);
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
        return;
      }
      
      toast.success("Você saiu com sucesso.");
      setAuthState({ 
        user: null, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha ao sair. Por favor, tente novamente.";
      toast.error(errorMessage);
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  };

  const value = {
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
