
import { ReactNode, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useSecureContext } from "@/hooks/useSecureContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogOut, User, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const { 
    user, 
    solutionId,
    role,
    loading,
    error,
  } = useSecureContext();
  const { collapsed } = useSidebarCollapse(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DashboardLayout: Initial render with user:", user, "role:", role);
  }, [user, role]);

  // If loading, display a loading indicator
  if (loading) {
    console.log("DashboardLayout: In loading state");
    return (
      <div className="flex justify-center items-center h-screen p-4" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-hidden="true"></div>
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  // If there's an error, display an error message with reload button
  if (error) {
    console.log("DashboardLayout: Error state:", error);
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro no carregamento</AlertTitle>
          <AlertDescription className="flex flex-col">
            <span>{error}</span>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("DashboardLayout: No user found, redirecting to auth");
    return <Navigate to="/login" />;
  }

  console.log("DashboardLayout: Rendering dashboard with user", user, "role", role);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b h-16 px-4 flex items-center justify-between sticky top-0 bg-background z-10 shadow-sm">
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
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
