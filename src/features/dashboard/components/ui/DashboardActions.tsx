
import { Users, BarChart2, Activity, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  cardClasses, 
  spacing, 
  textClasses, 
  transitions, 
  buttonStateClasses 
} from "@/lib/utils";

/**
 * Componente que exibe ações rápidas para acesso no dashboard
 */
export const DashboardActions = () => {
  return (
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
  );
};
