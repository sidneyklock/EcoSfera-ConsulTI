
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { MessageSquare, Clock, Star, Calendar } from "lucide-react";
import { cn, responsive, spacing, transitions } from "@/lib/utils";

export const UserDashboard = () => {
  // Dados simulados (seriam obtidos por API em produção)
  const stats = {
    messages: 24,
    projectsCompleted: 3,
    tasksPending: 8,
    nextMeeting: "Hoje, 15:00",
  };

  return (
    <div className={spacing.section}>
      <WelcomeHeader />

      <div className={responsive.grid.cols4}>
        <StatsCard
          title="Mensagens"
          value={stats.messages}
          description="Novas mensagens"
          icon={<MessageSquare className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Projetos Concluídos"
          value={stats.projectsCompleted}
          description="Neste mês"
          icon={<Star className="h-6 w-6" />}
          trend={{ value: 1, isPositive: true }}
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={stats.tasksPending}
          description="A serem concluídas"
          icon={<Clock className="h-6 w-6" />}
        />
        <StatsCard
          title="Próxima Reunião"
          value={stats.nextMeeting}
          description="Calendário"
          icon={<Calendar className="h-6 w-6" />}
        />
      </div>

      <div className={cn(responsive.grid.cols2, "mt-8")}>
        <div className={cn(
          "rounded-lg border bg-card shadow-sm p-6", 
          transitions.all,
          transitions.hover.elevate
        )}>
          <h3 className="font-medium text-lg mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Nova mensagem no projeto Alpha</p>
                <p className="text-xs text-muted-foreground">Há 10 minutos</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Projeto Beta concluído</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Reunião agendada</p>
                <p className="text-xs text-muted-foreground">Hoje, 15:00</p>
              </div>
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
              <MessageSquare className="h-5 w-5 mb-2" />
              <span className="text-sm">Iniciar Chat IA</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Calendar className="h-5 w-5 mb-2" />
              <span className="text-sm">Agendar Reunião</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Star className="h-5 w-5 mb-2" />
              <span className="text-sm">Novo Projeto</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}>
              <Clock className="h-5 w-5 mb-2" />
              <span className="text-sm">Ver Tarefas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
