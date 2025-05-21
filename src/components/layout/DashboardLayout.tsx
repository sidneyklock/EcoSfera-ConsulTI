
import { ReactNode, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useSecureContext } from "@/hooks/useSecureContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  const { signOut, authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DashboardLayout: Initial render with authState:", authState, "secureContext user:", user);
  }, [authState, user]);

  // If loading, display a loading indicator
  if (loading) {
    console.log("DashboardLayout: In loading state");
    return <LoadingSpinner />;
  }

  // If there's an error, display an error message
  if (error) {
    console.log("DashboardLayout: Error state:", error);
    return <ErrorDisplay />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("DashboardLayout: No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Check permissions if requiredRoles is specified
  if (requiredRoles && role && !requiredRoles.includes(role)) {
    console.log(`DashboardLayout: User role ${role} not in required roles [${requiredRoles.join(', ')}], redirecting to unauthorized`);
    return <Navigate to="/unauthorized" />;
  }

  console.log("DashboardLayout: Rendering dashboard with user", user, "role", role);

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
          <Button variant="ghost" size="sm" onClick={signOut}>
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
