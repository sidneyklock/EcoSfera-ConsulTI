
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useSecureContext } from "@/hooks/useSecureContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, role, loading, error, ErrorDisplay, LoadingSpinner } = useSecureContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("DashboardPage: Initial render with user:", user, "role:", role);
    
    // If user is not authenticated after loading completes, redirect to login
    if (!loading && !user) {
      console.log("DashboardPage: No authenticated user, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    console.log("DashboardPage: Loading state");
    return <LoadingSpinner />;
  }
  
  if (error) {
    console.log("DashboardPage: Error state:", error);
    return <ErrorDisplay />;
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
