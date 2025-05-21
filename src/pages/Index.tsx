
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";

const Index = () => {
  const { user } = useAuth();
  
  // Redirecionar para o dashboard se estiver autenticado
  // ou para a página de login se não estiver
  if (user) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Index;
