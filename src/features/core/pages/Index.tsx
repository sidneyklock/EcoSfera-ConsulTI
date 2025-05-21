
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { authState } = useAuth();
  
  // Redirecionar para o dashboard se estiver autenticado
  // ou para a página de login se não estiver
  if (authState.user) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Index;
