
import { useEffect, memo } from "react";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebarConfig } from "@/features/layout/hooks/useSidebarConfig";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { FallbackState } from "@/components/ui/fallback-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { logger } from "@/utils/logger";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

/**
 * Cabeçalho do dashboard com informações do usuário
 */
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

/**
 * Conteúdo principal do dashboard
 */
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

/**
 * Layout principal do dashboard
 * Gerencia o estado da autenticação e renderiza o conteúdo apropriado
 */
const DashboardLayout = () => {
  const { user, role, solutionId, isLoading, error } = useAuthService();
  const { collapsed } = useSidebarConfig();
  const { handleSignOut, userName } = useAuthActions();

  useEffect(() => {
    logger.debug({
      action: "dashboard_mounted",
      message: "DashboardLayout: Initial render",
      data: { 
        hasUser: !!user, 
        userRole: role, 
        hasSolutionId: !!solutionId 
      }
    });
    
    // Record performance timing
    const renderStart = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart;
      logger.debug({
        action: "dashboard_unmounted",
        message: `DashboardLayout render time: ${renderTime.toFixed(2)}ms`,
        data: { renderTimeMs: renderTime }
      });
    };
  }, [user, role, solutionId]);

  // Se estiver carregando, exibe um skeleton loader
  if (isLoading) {
    logger.debug({
      action: "dashboard_loading",
      message: "DashboardLayout: In loading state"
    });
    
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

  // Se houver um erro, exibe uma mensagem de erro com botão para recarregar
  if (error) {
    logger.error({
      userId: user?.id,
      action: "dashboard_error",
      message: "Error loading dashboard",
      data: { error }
    });
    
    return (
      <FallbackState 
        type="error" 
        title="Erro ao carregar o dashboard" 
        message={`Não foi possível carregar o dashboard: ${error}. Tente recarregar a página.`}
        action={{ label: "Tentar novamente", onClick: () => window.location.reload() }}
      />
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    logger.debug({
      action: "dashboard_redirect",
      message: "DashboardLayout: No user found, redirecting to auth"
    });
    
    return <Navigate to="/login" />;
  }

  logger.debug({
    userId: user.id,
    action: "dashboard_render",
    message: "Rendering dashboard",
    data: { userRole: role }
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader 
        userName={userName} 
        onSignOut={handleSignOut} 
      />
      
      <div className="flex flex-1">
        <AppSidebar 
          solutionId={solutionId} 
          userRole={role}
        />
        <DashboardContent collapsed={collapsed}>
          <Outlet />
        </DashboardContent>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
