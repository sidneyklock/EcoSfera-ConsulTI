
import { useEffect } from "react";
import { LoginForm } from "../components";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";
import { useAuthService } from "../hooks/useAuthService";

/**
 * Página de login com redirecionamento automático
 * Se o usuário já estiver autenticado, redireciona para o dashboard
 */
const LoginPage = () => {
  const { user, isLoading, error } = useAuthService();
  
  useEffect(() => {
    // Adiciona metadados para SEO
    document.title = "Login | Dashboard";
  }, []);
  
  // Exibe carregamento
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <FallbackState 
          type="loading" 
          title="Carregando" 
          message="Verificando estado de autenticação..." 
        />
      </div>
    );
  }
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Exibe erro se houver
  if (error && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <FallbackState 
          type="error" 
          title="Erro de autenticação" 
          message={error}
          action={{
            label: "Tentar novamente",
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  // Renderiza o formulário de login
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
