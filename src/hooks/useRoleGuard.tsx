
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/types";

/**
 * Hook para verificar se o usuário tem a role necessária para acessar um recurso
 * @param requiredRole A role necessária ou um array de roles permitidas
 * @param redirectTo (Opcional) Página para redirecionar em caso de acesso negado
 * @returns Um componente Navigate se o acesso for negado, null caso contrário
 */
export const useRoleGuard = (
  requiredRole: Role | Role[], 
  redirectTo = "/unauthorized"
) => {
  const { user, role, isLoading } = useAuth();

  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    return null;
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Converte para array se for uma única role
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Verifica se o usuário tem pelo menos uma das roles necessárias
  if (!role || !requiredRoles.includes(role)) {
    console.log(`Acesso negado: usuário tem role ${role}, mas precisa de uma dessas: ${requiredRoles.join(", ")}`);
    return <Navigate to={redirectTo} />;
  }

  // Se chegou aqui, o usuário tem permissão
  return null;
};
