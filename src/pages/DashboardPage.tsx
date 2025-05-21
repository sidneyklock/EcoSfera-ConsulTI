
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useSecureContext } from "@/hooks/useSecureContext";

const DashboardPage = () => {
  const { user } = useSecureContext();

  return (
    <>
      {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
};

export default DashboardPage;
