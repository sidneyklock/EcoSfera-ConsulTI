
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useSecureContext } from "@/hooks/useSecureContext";

const DashboardPage = () => {
  const { user, role, loading, ErrorDisplay, LoadingSpinner } = useSecureContext();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <div>Usuário não autenticado.</div>;
  }

  return (
    <>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
};

export default DashboardPage;
