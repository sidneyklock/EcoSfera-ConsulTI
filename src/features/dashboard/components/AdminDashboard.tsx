
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { Users, BarChart2, Activity, Briefcase } from "lucide-react";
import { UserRoleAssignment } from "@/features/admin/components/UserRoleAssignment";

export const AdminDashboard = () => {
  // Dados simulados (seriam obtidos por API em produção)
  const stats = {
    totalUsers: 1293,
    activeUsers: 857,
    totalProjects: 42,
    activeProjects: 24,
  };

  return (
    <div className="space-y-6">
      <WelcomeHeader />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="rounded-lg border bg-card shadow p-6">
          <h3 className="font-medium text-lg mb-4">Visão Geral do Sistema</h3>
          <p className="text-muted-foreground mb-4">
            Bem-vindo ao painel administrativo. Como administrador, você tem acesso a todas as funcionalidades do sistema, incluindo gerenciamento de usuários, análise de dados e configurações gerais.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Uso do Sistema</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow p-6">
          <h3 className="font-medium text-lg mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
              <Briefcase className="h-5 w-5 mb-1 mx-auto" />
              <span className="text-sm block">Novo Projeto</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
              <Users className="h-5 w-5 mb-1 mx-auto" />
              <span className="text-sm block">Gerenciar Usuários</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
              <BarChart2 className="h-5 w-5 mb-1 mx-auto" />
              <span className="text-sm block">Ver Relatórios</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
              <Activity className="h-5 w-5 mb-1 mx-auto" />
              <span className="text-sm block">Atividade</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <UserRoleAssignment />
      </div>
    </div>
  );
};
