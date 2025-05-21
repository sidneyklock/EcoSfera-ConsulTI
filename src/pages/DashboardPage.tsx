
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useSecureContext } from "@/hooks/useSecureContext";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, role, loading, error } = useSecureContext();
  
  useEffect(() => {
    console.log("DashboardPage: Initial render with user:", user, "role:", role);
  }, [user, role]);
  
  if (loading) {
    console.log("DashboardPage: Loading state");
    return <div>Carregando...</div>;
  }
  
  if (error) {
    console.log("DashboardPage: Error state:", error);
    return <div>Erro: {error}</div>;
  }
  
  if (!user) {
    console.log("DashboardPage: No user, showing redirection message");
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
