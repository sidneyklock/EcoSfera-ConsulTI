
import { Users, BarChart2, Activity, Briefcase } from "lucide-react";
import { UserRoleAssignment } from "@/features/admin/components/UserRoleAssignment";
import { 
  cn, 
  responsive, 
  spacing, 
  transitions, 
  cardClasses, 
  buttonStateClasses, 
  textClasses 
} from "@/lib/utils";
import { useStatsData } from "../hooks/useStatsData";
import { StatsCard } from "./shared/StatsCard";
import { WelcomeHeader } from "./shared/WelcomeHeader";
import { DashboardActions } from "./ui/DashboardActions";
import { SystemOverview } from "./ui/SystemOverview";

/**
 * Dashboard para administradores
 * Exibe estatísticas gerais do sistema e ações administrativas
 */
export const AdminDashboard = () => {
  const { adminStats, isLoading } = useStatsData();

  return (
    <div className={spacing.section}>
      <WelcomeHeader />

      <div className={responsive.grid.cols4}>
        <StatsCard
          title="Total de Usuários"
          value={adminStats.totalUsers}
          description="Todos os usuários registrados"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12.5, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Usuários Ativos"
          value={adminStats.activeUsers}
          description="Usuários ativos nos últimos 30 dias"
          icon={<Activity className="h-6 w-6" />}
          trend={{ value: 8.2, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total de Projetos"
          value={adminStats.totalProjects}
          description="Todos os projetos criados"
          icon={<Briefcase className="h-6 w-6" />}
          trend={{ value: 3.1, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Projetos Ativos"
          value={adminStats.activeProjects}
          description="Projetos ativos no momento"
          icon={<BarChart2 className="h-6 w-6" />}
          trend={{ value: 1.2, isPositive: false }}
          isLoading={isLoading}
        />
      </div>

      <div className={cn(responsive.grid.cols2, "mt-8")}>
        <SystemOverview />
        <DashboardActions />
      </div>
      
      <div className="mt-8">
        <div className={cn(cardClasses({ variant: "default" }), spacing.card)}>
          <UserRoleAssignment />
        </div>
      </div>
    </div>
  );
};
