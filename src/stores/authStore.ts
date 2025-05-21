
import { create } from 'zustand';
import { AuthStore, AuthState } from './types/auth.types';
import { authOperations } from './operations/auth';

// Estado inicial
const initialState: AuthState = {
  user: null,
  role: null,
  solutionId: null,
  isLoading: false,
  error: null
};

/**
 * Store para gerenciamento do estado de autenticação
 * Centraliza todas as operações de autenticação e mantém o estado do usuário atual
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  // Método para limpar erros
  clearError: () => authOperations.clearError(set),

  // Login com email e senha
  signIn: async (email, password) => 
    authOperations.signIn(email, password, set, get),

  // Registro com email e senha
  signUp: async (email, password, name) => 
    authOperations.signUp(email, password, name, set, get),

  // Login com Google
  signInWithGoogle: async () => 
    authOperations.signInWithGoogle(set),

  // Logout
  signOut: async () => {
    await authOperations.signOut(set, get);
  },

  // Atualizar contexto do usuário
  refreshContext: async () => 
    authOperations.refreshContext(set)
}));

// Seletores para evitar re-renderizações desnecessárias
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthRole = () => useAuthStore(state => state.role);
export const useAuthSolutionId = () => useAuthStore(state => state.solutionId);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAuthStatus = () => useAuthStore(state => ({
  isLoading: state.isLoading,
  error: state.error,
  isAuthenticated: !!state.user
}));
