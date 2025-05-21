
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useSecureContextStore } from "@/stores/secureContextStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRoles?: Role[];
}

export const DashboardLayout = ({ 
  children,
  requiredRoles = ["user", "admin"] 
}: DashboardLayoutProps) => {
  const { 
    user, 
    solutionId,
    role,
    loading,
    error, 
    fetchUserContext
  } = useSecureContextStore();
  const { collapsed } = useSidebarCollapse(false);

  // If loading, display a loading indicator with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex h-16 items-center px-4 border-b">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-[200px] ml-4" />
        </div>
        <div className="flex flex-1">
          <div className="w-64 border-r p-4 hidden md:block">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
          </div>
          <div className="flex-1 p-4 md:p-8">
            <Skeleton className="h-10 w-1/2 mb-6" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar o contexto</AlertTitle>
          <AlertDescription>
            {error}
            <button 
              onClick={() => fetchUserContext()} 
              className="mt-2 text-sm underline hover:text-primary transition-colors"
              aria-label="Tentar novamente"
            >
              Tentar novamente
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check permissions if requiredRoles is specified
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar 
        solutionId={solutionId} 
        userRole={role}
      />
      <div className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
      )}>
        <main 
          className="flex-1 p-4 md:p-8"
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
