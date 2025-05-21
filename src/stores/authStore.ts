
import { create } from 'zustand';
import { AuthStore, AuthState } from '@/types/auth.types';
import { authOperations } from './operations/auth';

const initialState: AuthState = {
  user: null,
  role: null,
  solutionId: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  clearError: () => authOperations.clearError(set),
  
  signIn: async (email, password) => 
    authOperations.signIn(email, password, set, get),
  
  signUp: async (email, password, name) => 
    authOperations.signUp(email, password, name, set, get),
  
  signInWithGoogle: async () => 
    authOperations.signInWithGoogle(set),
  
  signOut: async () => 
    authOperations.signOut(set, get),
  
  refreshContext: async () => 
    authOperations.refreshContext(set)
}));
