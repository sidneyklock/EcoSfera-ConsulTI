import { createContext, useContext, useState, useEffect, useReducer } from "react";
import { 
  signInWithEmailAndPassword as signInWithEmailAndPasswordService,
  signUpWithEmailAndPassword as signUpWithEmailAndPasswordService,
  signOut as signOutService,
  getCurrentSession as getCurrentSessionService,
  signInWithGoogle as signInWithGoogleService,
  setupAuthListener
} from "@/services/authService";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { useSecureContextStore } from '@/stores/secureContextStore';

type AuthContextType = {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, name?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean }>;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "LOADING" }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false, error: null };
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState: AuthState = {
    user: null,
    isLoading: true,
    error: null,
  };

  const [authState, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { createUserRecord } = useSecureContextStore();

  useEffect(() => {
    const unsubscribe = setupAuthListener(async (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    const checkSession = async () => {
      dispatch({ type: "LOADING" });
      try {
        const { user, error } = await getCurrentSessionService();
        if (error) {
          dispatch({ type: "ERROR", payload: error });
        } else if (user) {
          dispatch({ type: "LOGIN", payload: user });
        }
      } catch (error: any) {
        dispatch({ type: "ERROR", payload: error.message });
      } finally {
        dispatch({ type: "LOADING" });
      }
    };

    checkSession();

    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    dispatch({ type: "LOADING" });
    
    try {
      const { user, error } = await signInWithEmailAndPasswordService(email, password);
      
      if (error) {
        dispatch({ type: "ERROR", payload: error });
        return null;
      }
      
      if (user) {
        await createUserRecord(user);
        dispatch({ type: "LOGIN", payload: user });
      }
      
      return user;
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
      return null;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    dispatch({ type: "LOADING" });
    try {
      const { user, error } = await signUpWithEmailAndPasswordService(email, password, name);
      if (error) {
        dispatch({ type: "ERROR", payload: error });
        return null;
      }
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
        navigate("/verify-email");
      }
      return user;
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
      return null;
    }
  };

  const signOut = async () => {
    dispatch({ type: "LOADING" });
    try {
      await signOutService();
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    }
  };

  const signInWithGoogle = async () => {
    dispatch({ type: "LOADING" });
    
    try {
      const { error } = await signInWithGoogleService();
      
      if (error) {
        dispatch({ type: "ERROR", payload: error });
      }
      
      return { success: !error };
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
      return { success: false };
    }
  };

  const value: AuthContextType = {
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {authState.isLoading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
