
import { WelcomeHeader } from "./WelcomeHeader";
import { StatsCard } from "./StatsCard";
import { MessageSquare, Clock, Star, Calendar } from "lucide-react";

export const UserDashboard = () => {
  // Dados simulados (seriam obtidos por API em produção)
  const stats = {
    messages: 24,
    projectsCompleted: 3,
    tasksPending: 8,
    nextMeeting: "Hoje, 15:00",
  };

  return (
    <div className="space-y-8">
      <WelcomeHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card shadow-sm p-6 hover:shadow-md transition-all">
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

        <div className="rounded-lg border bg-card shadow-sm p-6 hover:shadow-md transition-all">
          <h3 className="font-medium text-lg mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-3 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <MessageSquare className="h-5 w-5 mb-2 mx-auto" />
              <span className="text-sm block">Iniciar Chat IA</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Calendar className="h-5 w-5 mb-2 mx-auto" />
              <span className="text-sm block">Agendar Reunião</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Star className="h-5 w-5 mb-2 mx-auto" />
              <span className="text-sm block">Novo Projeto</span>
            </button>
            <button className="p-3 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Clock className="h-5 w-5 mb-2 mx-auto" />
              <span className="text-sm block">Ver Tarefas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
