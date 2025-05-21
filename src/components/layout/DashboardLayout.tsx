
import { useEffect, memo, useMemo } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { FallbackState } from "@/components/ui/fallback-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Role } from "@/types";

const DashboardHeader = memo(({ userName, onSignOut }: { userName?: string, onSignOut: () => void }) => (
  <header className="border-b h-16 px-4 flex items-center justify-between sticky top-0 bg-background z-10 shadow-sm">
    <div className="flex items-center">
      <span className="font-medium text-lg md:ml-2">EcoSfera ConsulTI</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center mr-2">
        <UserIcon className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-sm font-medium hidden md:inline">{userName || 'Usuário'}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onSignOut} className="text-sm">
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden md:inline">Sair</span>
      </Button>
    </div>
  </header>
));

DashboardHeader.displayName = 'DashboardHeader';

const DashboardContent = memo(({ collapsed, children }: { collapsed: boolean, children: React.ReactNode }) => (
  <div className={cn(
    "flex-1 flex flex-col transition-all duration-300",
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
));

DashboardContent.displayName = 'DashboardContent';

const DashboardLayout = () => {
  const { user, role, solutionId, isLoading, error, signOut } = useAuth();
  const { collapsed } = useSidebarCollapse(false);
  const navigate = useNavigate();

  // Ensure role is properly typed as Role or null
  const userRole = role as Role | null;

  useEffect(() => {
    console.log("DashboardLayout: Initial render with user:", user, "role:", userRole);
  }, [user, userRole]);

  // Memoize the handle sign out function to prevent unnecessary re-renders
  const handleSignOut = useMemo(() => async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [signOut, navigate]);

  // If loading, display a skeleton loader instead of spinner
  if (isLoading) {
    console.log("DashboardLayout: In loading state");
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader userName={undefined} onSignOut={() => {}} />
        <div className="flex flex-1">
          <div className="w-64 h-screen border-r hidden md:block">
            <LoadingSkeleton variant="text" count={8} className="p-4" />
          </div>
          <div className="flex-1 p-8">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, display an error message with reload button
  if (error) {
    console.log("DashboardLayout: Error state:", error);
    return (
      <FallbackState 
        type="error" 
        title="Erro ao carregar o dashboard" 
        message={`Não foi possível carregar o dashboard: ${error}. Tente recarregar a página.`}
        action={{ label: "Tentar novamente", onClick: () => window.location.reload() }}
      />
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("DashboardLayout: No user found, redirecting to auth");
    return <Navigate to="/login" />;
  }

  console.log("DashboardLayout: Rendering dashboard with user", user, "role", userRole);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader 
        userName={user?.name || user?.email} 
        onSignOut={handleSignOut} 
      />
      
      <div className="flex flex-1">
        <AppSidebar 
          solutionId={solutionId} 
          userRole={userRole}
        />
        <DashboardContent collapsed={collapsed}>
          <Outlet />
        </DashboardContent>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
