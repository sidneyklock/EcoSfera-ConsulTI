
import { MessageSquare, Clock, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  responsive, 
  spacing, 
  cardClasses, 
  transitions, 
  layoutClasses, 
  textClasses, 
  buttonStateClasses, 
  iconClasses, 
  a11yClasses 
} from "@/lib/utils";
import { useStatsData } from "../hooks/useStatsData";
import { StatsCard } from "./shared/StatsCard";
import { WelcomeHeader } from "./shared/WelcomeHeader";
import { RecentActivity } from "./ui/RecentActivity";
import { UserQuickActions } from "./ui/UserQuickActions";

/**
 * Dashboard para usuários regulares
 * Exibe estatísticas e ações relevantes para o usuário
 */
export const UserDashboard = () => {
  const { userStats, isLoading } = useStatsData();

  return (
    <div className={spacing.section}>
      <WelcomeHeader />

      <div className={responsive.grid.cols4}>
        <StatsCard
          title="Mensagens"
          value={userStats.messages}
          description="Novas mensagens"
          icon={<MessageSquare className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Projetos Concluídos"
          value={userStats.projectsCompleted}
          description="Neste mês"
          icon={<Star className="h-6 w-6" />}
          trend={{ value: 1, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={userStats.tasksPending}
          description="A serem concluídas"
          icon={<Clock className="h-6 w-6" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Próxima Reunião"
          value={userStats.nextMeeting}
          description="Calendário"
          icon={<Calendar className="h-6 w-6" />}
          isLoading={isLoading}
        />
      </div>

      <div className={cn(responsive.grid.cols2, "mt-8")}>
        <RecentActivity />
        <UserQuickActions />
      </div>
    </div>
  );
};
