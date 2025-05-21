
import { useAuthStore } from '@/stores/authStore';
import { useCallback, useMemo } from 'react';
import { User, Role } from '@/types';

interface AuthContextData {
  user: User | null;
  role: Role | null;
  solutionId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para acessar o contexto de autenticação do usuário
 */
export function useAuthContext() {
  const { 
    user, 
    role, 
    solutionId, 
    isLoading, 
    error,
    refreshContext
  } = useAuthStore();
  
  // Validar role para type safety
  const validatedRole = useMemo(() => {
    const validRoles: Role[] = ["anon", "user", "admin", "system", "member", "owner"];
    return (role && typeof role === 'string' && validRoles.includes(role as Role)) 
      ? role as Role 
      : null;
  }, [role]);
  
  // Memoizar dados do contexto para prevenir re-renderizações
  const contextData = useMemo<AuthContextData>(() => ({
    user,
    role: validatedRole,
    solutionId,
    isLoading,
    error
  }), [user, validatedRole, solutionId, isLoading, error]);

  // Atualizar o contexto do usuário
  const refetchContext = useCallback(async () => {
    try {
      await refreshContext();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [refreshContext]);

  // Verificar se o usuário está autenticado
  const isAuthenticated = useMemo(() => {
    return !!user;
  }, [user]);

  // Verificar se o usuário tem uma determinada role
  const hasRole = useCallback((requiredRole: Role | Role[]) => {
    if (!validatedRole) return false;
    
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return requiredRoles.includes(validatedRole);
  }, [validatedRole]);

  return { 
    ...contextData,
    refetchContext,
    isAuthenticated,
    hasRole
  };
}
