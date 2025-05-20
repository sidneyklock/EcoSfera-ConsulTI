
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRoles?: Role[];
}

export const DashboardLayout = ({ 
  children,
  requiredRoles = ["user", "admin"] 
}: DashboardLayoutProps) => {
  const { authState } = useAuth();
  const { user, isLoading } = authState;

  // Se estiver carregando, exibe um indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Verifica permissões se requiredRoles for especificado
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className={cn(
        "flex-1 ml-0 md:ml-64 transition-all duration-300",
      )}>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
