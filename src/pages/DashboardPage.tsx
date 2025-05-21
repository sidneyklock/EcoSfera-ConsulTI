
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useSecureContext } from "@/hooks/useSecureContext";

const DashboardPage = () => {
  const { user, role, loading, error, ErrorDisplay, LoadingSpinner } = useSecureContext();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay />;
  }
  
  if (!user) {
    return <div className="p-4">Usuário não autenticado. Redirecionando...</div>;
  }

  console.log("DashboardPage: Rendering dashboard for user role:", role);
  
  return (
    <>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
};

export default DashboardPage;
