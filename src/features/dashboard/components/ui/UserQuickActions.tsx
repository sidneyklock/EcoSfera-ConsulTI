
import { MessageSquare, Calendar, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {  
  cardClasses, 
  spacing, 
  textClasses, 
  transitions, 
  buttonStateClasses,
  iconClasses,
  a11yClasses
} from "@/lib/utils";

/**
 * Componente para exibir as ações rápidas disponíveis ao usuário
 */
export const UserQuickActions = () => {
  return (
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
  );
};
