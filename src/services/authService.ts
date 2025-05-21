
import { supabase } from "@/integrations/supabase/client";
import { User as AppUser } from "@/types";
import { AuthError, Provider } from "@supabase/supabase-js";

// Tipos para os erros mapeados
type ErrorMap = {
  [key: string]: string;
};

// Mapeamento de erros para mensagens amigáveis
const authErrorMessages: ErrorMap = {
  "Invalid login credentials": "Credenciais inválidas. Verifique seu e-mail e senha.",
  "Email not confirmed": "E-mail não confirmado. Verifique sua caixa de entrada.",
  "User already registered": "Este e-mail já está cadastrado.",
  "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
  "Email format is invalid": "Formato de e-mail inválido.",
  "network_error": "Erro de conexão. Verifique sua internet e tente novamente.",
  "default": "Ocorreu um erro na autenticação. Tente novamente mais tarde."
};

/**
 * Mapeia erros do Supabase para mensagens amigáveis em português
 */
export const getErrorMessage = (error: AuthError | null): string => {
  if (!error) return "";
  
  // Verifica se é um erro de rede
  if (error.message?.includes("fetch")) {
    return authErrorMessages["network_error"];
  }
  
  // Busca a mensagem mapeada ou retorna a mensagem padrão
  return authErrorMessages[error.message] || authErrorMessages["default"];
};

/**
 * Login com e-mail e senha
 */
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    // Convertendo o usuário do Supabase para o formato da aplicação
    const user = data.user ? mapUserData(data.user) : null;
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

/**
 * Login com Google
 */
export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error as AuthError) };
  }
};

/**
 * Registro de novo usuário
 */
export const signUpWithEmailAndPassword = async (email: string, password: string, name?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) throw error;
    
    const user = data.user ? mapUserData(data.user) : null;
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

/**
 * Logout do usuário
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error as AuthError) };
  }
};

/**
 * Obter a sessão atual
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    const user = data.session?.user ? mapUserData(data.session.user) : null;
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

/**
 * Função auxiliar para mapear dados do usuário Supabase para o formato da aplicação
 */
const mapUserData = (supabaseUser: any): AppUser => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    role: supabaseUser.user_metadata?.role || 'user'
  };
};

/**
 * Configurar listener para mudanças no estado de autenticação
 */
export const setupAuthListener = (callback: (user: AppUser | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ? mapUserData(session.user) : null;
    callback(user);
  });
  
  return data.subscription;
};
