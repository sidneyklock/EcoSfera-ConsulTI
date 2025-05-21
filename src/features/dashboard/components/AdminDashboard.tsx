
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { Users, BarChart2, Activity, Briefcase } from "lucide-react";
import { UserRoleAssignment } from "@/features/admin/components/UserRoleAssignment";
import { cn, responsive, spacing, transitions } from "@/lib/utils";

export const AdminDashboard = () => {
  // Dados simulados (seriam obtidos por API em produção)
  const stats = {
    totalUsers: 1293,
    activeUsers: 857,
    totalProjects: 42,
    activeProjects: 24,
  };

  return (
    <div className={spacing.section}>
      <WelcomeHeader />

      <div className={responsive.grid.cols4}>
        <StatsCard
          title="Total de Usuários"
          value={stats.totalUsers}
          description="Todos os usuários registrados"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          description="Usuários ativos nos últimos 30 dias"
          icon={<Activity className="h-6 w-6" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Total de Projetos"
          value={stats.totalProjects}
          description="Todos os projetos criados"
          icon={<Briefcase className="h-6 w-6" />}
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatsCard
          title="Projetos Ativos"
          value={stats.activeProjects}
          description="Projetos ativos no momento"
          icon={<BarChart2 className="h-6 w-6" />}
          trend={{ value: 1.2, isPositive: false }}
        />
      </div>

      <div className={cn(responsive.grid.cols2, "mt-8")}>
        <div className={cn(
          "rounded-lg border bg-card shadow-sm p-6", 
          transitions.all,
          transitions.hover.elevate
        )}>
          <h3 className="font-medium text-lg mb-4">Visão Geral do Sistema</h3>
          <p className="text-muted-foreground mb-6">
            Bem-vindo ao painel administrativo. Como administrador, você tem acesso a todas as funcionalidades do sistema, incluindo gerenciamento de usuários, análise de dados e configurações gerais.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Uso do Sistema</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: "85%" }}
                role="progressbar" 
                aria-valuenow={85} 
                aria-valuemin={0} 
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border bg-card shadow-sm p-6", 
          transitions.all,
          transitions.hover.elevate
        )}>
          <h3 className="font-medium text-lg mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Briefcase className="h-5 w-5 mb-2" />
              <span className="text-sm">Novo Projeto</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Users className="h-5 w-5 mb-2" />
              <span className="text-sm">Gerenciar Usuários</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <BarChart2 className="h-5 w-5 mb-2" />
              <span className="text-sm">Ver Relatórios</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Activity className="h-5 w-5 mb-2" />
              <span className="text-sm">Atividade</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className={cn(
          "rounded-lg border bg-card shadow-sm p-6",
          transitions.all, 
          transitions.hover.elevate
        )}>
          <UserRoleAssignment />
        </div>
      </div>
    </div>
  );
};
