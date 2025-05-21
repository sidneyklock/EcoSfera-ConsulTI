
import { useEffect } from "react";
import { RegisterForm } from "../components";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { FallbackState } from "@/components/ui/fallback-state";

/**
 * Página de registro com redirecionamento automático
 * Se o usuário já estiver autenticado, redireciona para o dashboard
 */
const RegisterPage = () => {
  const { authState } = useAuth();
  const { user, isLoading, error } = authState;
  
  useEffect(() => {
    // Adiciona metadados para SEO
    document.title = "Registro | Dashboard";
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

  // Renderiza o formulário de registro
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
