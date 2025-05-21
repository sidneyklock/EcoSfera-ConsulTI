
import { cn } from "@/lib/utils";
import { cardClasses, spacing, textClasses } from "@/lib/utils";

/**
 * Componente que exibe uma visão geral do sistema para administradores
 */
export const SystemOverview = () => {
  return (
    <div className={cn(cardClasses({ variant: "interactive" }), spacing.card)}>
      <h3 className={cn(textClasses.heading.h3, spacing.cardHeader)}>Visão Geral do Sistema</h3>
      <p className="text-muted-foreground mb-6">
        Bem-vindo ao painel administrativo. Como administrador, você tem acesso a todas as funcionalidades do sistema, 
        incluindo gerenciamento de usuários, análise de dados e configurações gerais.
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
  );
};
