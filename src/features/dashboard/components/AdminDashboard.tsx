import { WelcomeHeader, StatsCard } from "@/components/shared";
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
        <div className={cn(cardClasses({ variant: "interactive" }), spacing.card)}>
          <h3 className={cn(textClasses.heading.h3, spacing.cardHeader)}>Visão Geral do Sistema</h3>
          <p className="text-muted-foreground mb-6">
            Bem-vindo ao painel administrativo. Como administrador, você tem acesso a todas as funcionalidades do sistema, incluindo gerenciamento de usuários, análise de dados e configurações gerais.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={textClasses.base}>Uso do Sistema</span>
              <span className={textClasses.base}>85%</span>
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

        <div className={cn(cardClasses({ variant: "interactive" }), spacing.card)}>
          <h3 className={cn(textClasses.heading.h3, spacing.cardHeader)}>Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <Briefcase className="h-5 w-5 mb-2" />
              <span className="text-sm">Novo Projeto</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <Users className="h-5 w-5 mb-2" />
              <span className="text-sm">Gerenciar Usuários</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <BarChart2 className="h-5 w-5 mb-2" />
              <span className="text-sm">Ver Relatórios</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <Activity className="h-5 w-5 mb-2" />
              <span className="text-sm">Atividade</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className={cn(cardClasses({ variant: "default" }), spacing.card)}>
          <UserRoleAssignment />
        </div>
      </div>
    </div>
  );
};
