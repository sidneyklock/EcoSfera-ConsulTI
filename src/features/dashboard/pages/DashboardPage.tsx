import { memo, useEffect } from "react";
import { AdminDashboard, UserDashboard } from "@/features/dashboard/components";
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";
import { PageLayout } from "@/layouts";
import { logger, dispatchPageLoadStart, dispatchPageLoadComplete } from "@/utils";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { animations, responsive, spacing, textClasses } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Dashboard page component with standardized fallbacks
 * Uses memo to prevent unnecessary re-renders
 */
const DashboardPage = memo(() => {
  // O hook useAuthStore é mantido no componente de nível superior
  // para centralizar a gestão de estado
  const { user, role, isLoading, error } = useAuthStore();
  
  useEffect(() => {
    // Registrar início do carregamento da página
    const startTime = performance.now();
    dispatchPageLoadStart('DashboardPage');
    
    logger.info({
      userId: user?.id,
      action: "dashboard_load",
      message: `Dashboard inicializado para usuário com papel: ${role || 'desconhecido'}`
    });
    
    return () => {
      // Registrar conclusão do carregamento quando o componente está completamente montado
      dispatchPageLoadComplete('DashboardPage', performance.now() - startTime, undefined, user);
    };
  }, [user, role]);
  
  // Loading state
  if (isLoading) {
    logger.debug({
      action: "dashboard_loading",
      message: "Dashboard em carregamento"
    });
    
    // Use skeleton loader instead of spinner for better UX
    return (
      <div className={cn(spacing.container, animations.fadeIn)}>
        <LoadingSkeleton variant="text" className="h-8 w-1/3 mb-6" />
        <LoadingSkeleton variant="text" className="h-4 w-1/2 mb-8" />
        
        <div className={responsive.grid.cols4}>
          <LoadingSkeleton variant="stats" />
          <LoadingSkeleton variant="stats" />
          <LoadingSkeleton variant="stats" />
          <LoadingSkeleton variant="stats" />
        </div>
        
        <div className={cn(responsive.grid.cols2, "mt-8")}>
          <LoadingSkeleton variant="card" className="h-64" />
          <LoadingSkeleton variant="card" className="h-64" />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    logger.error({
      userId: user?.id,
      action: "dashboard_error",
      message: "Erro ao carregar dashboard",
      data: { errorMessage: error }
    });
    
    return (
      <FallbackState 
        type="error" 
        title="Erro ao carregar o dashboard" 
        message={`Não foi possível carregar seus dados: ${error}. Tente novamente mais tarde.`}
        action={{
          label: "Tentar novamente",
          onClick: () => window.location.reload()
        }}
      />
    );
  }
  
  // Unauthorized state
  if (!user) {
    logger.warn({
      action: "dashboard_unauthorized",
      message: "Tentativa de acesso ao dashboard sem autenticação"
    });
    return <Navigate to="/login" />;
  }

  logger.info({
    userId: user.id,
    action: "dashboard_render",
    message: `Renderizando dashboard para papel: ${role}`
  });
  
  // Renderização do dashboard adequado baseado no papel do usuário
  return (
    <PageLayout 
      title="Dashboard" 
      description="Bem-vindo ao painel de controle da EcoSfera ConsulTI"
    >
      <div className={cn(spacing.container, animations.fadeIn, "py-6")}>
        {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </PageLayout>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
