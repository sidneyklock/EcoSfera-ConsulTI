import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleGoBack = () => {
    // Redirect based on user role
    if (authState.user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Acesso Não Autorizado</h1>
          <p className="text-lg">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
        <Button onClick={handleGoBack} className="w-full">
          Voltar para Área Segura
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
