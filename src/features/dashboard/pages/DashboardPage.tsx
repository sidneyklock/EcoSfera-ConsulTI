
import { memo, useEffect } from "react";
import { AdminDashboard, UserDashboard } from "@/features/dashboard/components";
import { useUserContext } from "@/features/auth/hooks";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";
import { PageLayout } from "@/layouts";
import { logger, dispatchPageLoadStart, dispatchPageLoadComplete } from "@/utils";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

/**
 * Dashboard page component with standardized fallbacks
 * Uses memo to prevent unnecessary re-renders
 */
const DashboardPage = memo(() => {
  const { data: userData, isLoading: userLoading, error: userError } = useUserContext();
  const { user, role } = userData || {};
  
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
  
  if (userLoading) {
    logger.debug({
      action: "dashboard_loading",
      message: "Dashboard em carregamento"
    });
    
    // Use skeleton loader instead of spinner for better UX
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" className="h-8 w-1/3" />
        <LoadingSkeleton variant="text" className="h-4 w-1/2" />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
        
        <LoadingSkeleton variant="table" />
      </div>
    );
  }
  
  if (userError) {
    logger.error({
      userId: user?.id,
      action: "dashboard_error",
      message: "Erro ao carregar dashboard",
      data: { errorMessage: userError }
    });
    
    return (
      <FallbackState 
        type="error" 
        title="Erro ao carregar o dashboard" 
        message={`Não foi possível carregar seus dados: ${userError}. Tente novamente mais tarde.`}
        action={{
          label: "Tentar novamente",
          onClick: () => window.location.reload()
        }}
      />
    );
  }
  
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
  
  return (
    <PageLayout 
      title="Dashboard" 
      description="Bem-vindo ao painel de controle da EcoSfera ConsulTI"
    >
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </PageLayout>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
