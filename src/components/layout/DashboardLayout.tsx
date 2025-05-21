
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useSecureContext } from "@/hooks/useSecureContext";

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

  // If loading, display a loading indicator
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
    <div className="flex min-h-screen bg-background">
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
  );
};
