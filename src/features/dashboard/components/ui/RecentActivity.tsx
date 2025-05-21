
import { cn } from "@/lib/utils";
import { 
  cardClasses, 
  spacing, 
  textClasses, 
  layoutClasses,
  iconClasses 
} from "@/lib/utils";
import { MessageSquare, Star, Calendar } from "lucide-react";

/**
 * Componente para exibir atividades recentes do usuário
 */
export const RecentActivity = () => {
  return (
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
  );
};
