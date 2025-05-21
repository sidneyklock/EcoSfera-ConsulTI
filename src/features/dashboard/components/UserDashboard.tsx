
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { MessageSquare, Clock, Star, Calendar } from "lucide-react";
import { cn, responsive, spacing, transitions, cardClasses, buttonStateClasses } from "@/lib/utils";

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
        <div className={cn(cardClasses({ variant: "interactive" }), spacing.card)}>
          <h3 className={cn(textClasses.heading.h3, spacing.cardHeader)}>Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className={textClasses.base}>Nova mensagem no projeto Alpha</p>
                <p className={textClasses.secondary}>Há 10 minutos</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className={textClasses.base}>Projeto Beta concluído</p>
                <p className={textClasses.secondary}>Há 2 horas</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className={textClasses.base}>Reunião agendada</p>
                <p className={textClasses.secondary}>Hoje, 15:00</p>
              </div>
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
              <MessageSquare className="h-5 w-5 mb-2" />
              <span className="text-sm">Iniciar Chat IA</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <Calendar className="h-5 w-5 mb-2" />
              <span className="text-sm">Agendar Reunião</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
            )}>
              <Star className="h-5 w-5 mb-2" />
              <span className="text-sm">Novo Projeto</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center", 
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active
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
