
import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "../types";

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

  // Simulando integração com Supabase (será implementado quando conectar Supabase)
  useEffect(() => {
    // Verificar se há um usuário em localStorage (apenas para demonstração)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        // Quando integrado com Supabase, a role virá de:
        // 1. user.user_metadata.role OU
        // 2. Consulta à tabela profiles vinculada ao user.id
        setAuthState({ user, isLoading: false, error: null });
      } catch (error) {
        console.error("Erro ao analisar usuário armazenado:", error);
        setAuthState({ user: null, isLoading: false, error: null });
      }
    } else {
      setAuthState({ user: null, isLoading: false, error: null });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Simular um login (será substituído pela integração com Supabase)
      // Em produção, use: const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // Quando integrado com Supabase, obtenha a role de:
      // 1. data.user.user_metadata.role OU
      // 2. Consulta à tabela profiles vinculada ao data.user.id
      // const role = data.user.user_metadata.role || await getProfileRole(data.user.id) || "user";
      
      // Para demonstração, vamos usar um valor padrão "user"
      const defaultRole = "user";
      
      // Para demonstração, vamos simular um usuário
      const mockUser: User = {
        id: "1",
        email,
        role: defaultRole, // Valor padrão, será substituído pela role do Supabase
        name: email.split("@")[0],
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setAuthState({ user: mockUser, isLoading: false, error: null });
    } catch (error) {
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Falha no login. Por favor, tente novamente." 
      }));
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Simular um registro (será substituído pela integração com Supabase)
      // Em produção, use: const { data, error } = await supabase.auth.signUp({ email, password });
      
      // Quando integrado com Supabase, defina a role padrão como "user" e crie um perfil
      // const defaultRole = "user";
      // await supabase.from('profiles').insert({ id: data.user.id, role: defaultRole, name: name || email.split("@")[0] });
      
      // Para demonstração, vamos simular um usuário com role padrão "user"
      const mockUser: User = {
        id: "1",
        email,
        role: "user", // Role padrão para novos usuários
        name: name || email.split("@")[0],
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setAuthState({ user: mockUser, isLoading: false, error: null });
    } catch (error) {
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Falha no registro. Por favor, tente novamente." 
      }));
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Em produção, use: const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      // Quando o usuário for autenticado, obtenha a role de forma similar ao signIn
      
      alert("Função será implementada quando integrada com Supabase");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Falha no login com Google. Por favor, tente novamente." 
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Em produção, use: await supabase.auth.signOut();
      
      localStorage.removeItem("user");
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setAuthState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Falha ao sair. Por favor, tente novamente." 
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
