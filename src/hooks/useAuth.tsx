
/**
 * Este arquivo é mantido apenas para compatibilidade com o código existente.
 * Recomenda-se utilizar o hook useAuthService do diretório features.
 * @deprecated Use useAuthService from @/features/auth/hooks instead
 */

import { useAuth as useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const auth = useAuthContext();
  
  // Extraindo os dados do contexto e convertendo para o formato esperado pelos componentes existentes
  const {
    authState: { user, isLoading, error, role, solutionId, session },
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  } = auth;
  
  // Mantendo o formato compatível com o código existente
  return {
    user,
    role,
    solutionId,
    isLoading,
    error,
    signIn,
    signUp, 
    signOut,
    signInWithGoogle,
    refreshContext: async () => ({ success: true }),
  };
}

export default useAuth;
