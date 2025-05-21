
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { MessageSquare, Clock, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { responsive, spacing, cardClasses, transitions, layoutClasses, textClasses, buttonStateClasses, iconClasses, a11yClasses } from "@/lib/utils";

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
            <div className={layoutClasses.flexCenterGap}>
              <div className={cn(iconClasses.container, "p-2")}>
                <MessageSquare className={cn(iconClasses.base, "h-4 w-4")} />
              </div>
              <div>
                <p className={textClasses.base}>Nova mensagem no projeto Alpha</p>
                <p className={textClasses.secondary}>Há 10 minutos</p>
              </div>
            </div>
            <div className={layoutClasses.flexCenterGap}>
              <div className={cn(iconClasses.container, "p-2")}>
                <Star className={cn(iconClasses.base, "h-4 w-4")} />
              </div>
              <div>
                <p className={textClasses.base}>Projeto Beta concluído</p>
                <p className={textClasses.secondary}>Há 2 horas</p>
              </div>
            </div>
            <div className={layoutClasses.flexCenterGap}>
              <div className={cn(iconClasses.container, "p-2")}>
                <Calendar className={cn(iconClasses.base, "h-4 w-4")} />
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
              buttonStateClasses.active,
              a11yClasses.focusVisible
            )}
              aria-label="Iniciar Chat IA">
              <MessageSquare className={cn(iconClasses.base, "mb-1")} />
              <span className={textClasses.base}>Iniciar Chat IA</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active,
              a11yClasses.focusVisible
            )}
              aria-label="Agendar Reunião">
              <Calendar className={cn(iconClasses.base, "mb-1")} />
              <span className={textClasses.base}>Agendar Reunião</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active,
              a11yClasses.focusVisible
            )}
              aria-label="Novo Projeto">
              <Star className={cn(iconClasses.base, "mb-1")} />
              <span className={textClasses.base}>Novo Projeto</span>
            </button>
            <button className={cn(
              "p-3 border rounded-lg flex flex-col items-center justify-center",
              transitions.colors,
              buttonStateClasses.hover,
              buttonStateClasses.focus,
              buttonStateClasses.active,
              a11yClasses.focusVisible
            )}
              aria-label="Ver Tarefas">
              <Clock className={cn(iconClasses.base, "mb-1")} />
              <span className={textClasses.base}>Ver Tarefas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
