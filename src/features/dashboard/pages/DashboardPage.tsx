
import { AdminDashboard, UserDashboard } from "@/features/dashboard/components";
import { useUserContext } from "@/features/auth/hooks";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";
import { PageLayout } from "@/layouts";

const DashboardPage = () => {
  const { data: userData, isLoading: userLoading, error: userError } = useUserContext();
  const { user, role } = userData || {};
  
  useEffect(() => {
    console.log("DashboardPage: Initial render with user:", user, "role:", role);
  }, [user, role]);
  
  if (userLoading) {
    console.log("DashboardPage: Loading state");
    return <FallbackState type="loading" />;
  }
  
  if (userError) {
    console.log("DashboardPage: Error state:", userError);
    return <FallbackState 
      type="error" 
      title="Erro ao carregar o dashboard" 
      message={userError} 
    />;
  }
  
  if (!user) {
    console.log("DashboardPage: No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  console.log("DashboardPage: Rendering dashboard for user role:", role);
  
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
