
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useSecureContext } from "@/hooks/useSecureContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children?: ReactNode;
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
    LoadingSpinner,
    ErrorDisplay
  } = useSecureContext();
  const { collapsed } = useSidebarCollapse(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // If loading, display a loading indicator
  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col" 
        aria-busy="true" 
        aria-label="Carregando painel"
      >
        <div className="flex h-16 items-center px-4 border-b">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-[200px] ml-4 rounded-md" />
        </div>
        <div className="flex flex-1">
          <div className="w-64 border-r p-4 hidden md:block">
            <Skeleton className="h-10 w-full mb-4 rounded-md" />
            <Skeleton className="h-6 w-full mb-3 rounded-md" />
            <Skeleton className="h-6 w-full mb-3 rounded-md" />
            <Skeleton className="h-6 w-full mb-3 rounded-md" />
          </div>
          <div className="flex-1 p-4 md:p-8">
            <Skeleton className="h-8 w-1/2 mb-6 rounded-md" />
            <Skeleton className="h-24 w-full mb-5 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return <ErrorDisplay />;
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium text-lg md:ml-2">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-2">
            <User className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm font-medium hidden md:inline">{user?.name || user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </header>
      
      {/* Main layout */}
      <div className="flex flex-1">
        <AppSidebar 
          solutionId={solutionId} 
          userRole={role}
        />
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
        )}>
          <main 
            className="flex-1 p-4 md:p-8"
            aria-live="polite"
            aria-relevant="additions removals"
          >
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};
