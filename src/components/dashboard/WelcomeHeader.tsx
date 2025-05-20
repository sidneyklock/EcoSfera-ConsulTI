
import { useAuth } from "@/context/AuthContext";

export const WelcomeHeader = () => {
  const { authState } = useAuth();
  const { user } = authState;

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
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {getGreeting()}, {displayName}!
      </h1>
      <p className="text-muted-foreground mt-2">
        Bem-vindo ao seu dashboard. Aqui está o resumo dos seus dados.
      </p>
    </div>
  );
};
