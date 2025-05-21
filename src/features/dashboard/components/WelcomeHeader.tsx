
import { useAuthStore } from "@/stores/authStore";
import { textClasses, spacing } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const WelcomeHeader = () => {
  const { user } = useAuthStore();

  // Determina o período do dia para saudação
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Nome para exibição
  const displayName = user?.name || user?.email?.split("@")[0] || "Usuário";

  return (
    <div className={spacing.cardHeader}>
      <h1 className={cn(textClasses.heading.h1)}>
        {getGreeting()}, {displayName}!
      </h1>
      <p className="text-muted-foreground mt-2">
        Bem-vindo ao seu dashboard. Aqui está o resumo dos seus dados.
      </p>
    </div>
  );
};
