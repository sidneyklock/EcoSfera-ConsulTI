
import { AdminDashboard, UserDashboard } from "@/features/dashboard/components";
import { useUserContext } from "@/features/auth/hooks";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";
import { PageLayout } from "@/layouts";
import { logger } from "@/utils/logger";

const DashboardPage = () => {
  const { data: userData, isLoading: userLoading, error: userError } = useUserContext();
  const { user, role } = userData || {};
  
  useEffect(() => {
    logger.info({
      userId: user?.id,
      action: "dashboard_load",
      message: `Dashboard inicializado para usuário com papel: ${role || 'desconhecido'}`
    });
  }, [user, role]);
  
  if (userLoading) {
    logger.debug({
      action: "dashboard_loading",
      message: "Dashboard em carregamento"
    });
    return <FallbackState type="loading" />;
  }
  
  if (userError) {
    logger.error({
      userId: user?.id,
      action: "dashboard_error",
      message: "Erro ao carregar dashboard",
      data: { errorMessage: userError }
    });
    return <FallbackState 
      type="error" 
      title="Erro ao carregar o dashboard" 
      message={userError} 
    />;
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
};

export default DashboardPage;
