
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <DashboardLayout>
      {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </DashboardLayout>
  );
};

export default DashboardPage;
