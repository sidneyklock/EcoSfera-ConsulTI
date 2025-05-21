
import { Role, User } from '@/types';

export interface AuthState {
  user: User | null;
  role: Role | null;
  solutionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthSignInResult {
  success: boolean;
  user: User | null;
  error?: string;
}

export interface AuthSignUpResult {
  success: boolean;
  user: User | null;
  error?: string;
}

export interface GoogleSignInResult {
  success: boolean;
  error?: string;
}

export interface AuthRefreshResult {
  success: boolean;
  error?: string;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, name?: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<GoogleSignInResult>;
  signOut: () => Promise<void>;
  refreshContext: () => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;
