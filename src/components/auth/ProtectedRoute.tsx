
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureContext } from '@/hooks/useSecureContext';
import { Role } from '@/types';
import { FallbackState } from '@/components/ui/fallback-state';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role | Role[];
  requiredSolution?: string;
}

/**
 * ProtectedRoute - Componente para proteger rotas baseado em autenticação e permissões
 * 
 * @param children - Componentes filho a serem renderizados quando o acesso é permitido
 * @param requiredRole - Role necessária ou array de roles permitidas (opcional)
 * @param requiredSolution - ID da solução que o usuário precisa ter acesso (opcional)
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredSolution 
}: ProtectedRouteProps) => {
  // Obter o contexto seguro do usuário
  const { user, solutionId, role, loading, error } = useSecureContext();
  
  // Enquanto carrega, mostrar o spinner
  if (loading) {
    return <FallbackState type="loading" title="Carregando" message="Verificando suas credenciais..." />;
  }
  
  // Se houver erro, mostrar mensagem de erro
  if (error) {
    return <FallbackState 
      type="error" 
      title="Erro de autenticação" 
      message={error} 
    />;
  }
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Verificar se o usuário tem a role necessária (se especificada)
  if (requiredRole && role) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!requiredRoles.includes(role)) {
      return <Navigate to="/unauthorized" />;
    }
  }
  
  // Verificar se o usuário tem acesso à solução necessária (se especificada)
  if (requiredSolution && solutionId !== requiredSolution) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Se todas as verificações passaram, renderizar os filhos
  return <>{children}</>;
};
