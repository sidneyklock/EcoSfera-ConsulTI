
import { AdminDashboard, UserDashboard } from "@/features/dashboard/components";
import { useUserContext } from "@/features/auth/hooks";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageLayout } from "@/layouts";

const DashboardPage = () => {
  const { data: userData, isLoading: userLoading, error: userError } = useUserContext();
  const { user, role } = userData || {};
  
  useEffect(() => {
    console.log("DashboardPage: Initial render with user:", user, "role:", role);
  }, [user, role]);
  
  if (userLoading) {
    console.log("DashboardPage: Loading state");
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (userError) {
    console.log("DashboardPage: Error state:", userError);
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar o dashboard</AlertTitle>
        <AlertDescription>{userError}</AlertDescription>
      </Alert>
    );
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
