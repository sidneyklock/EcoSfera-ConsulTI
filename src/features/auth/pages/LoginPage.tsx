import { useEffect } from "react";
import { LoginForm } from "../components";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { authState } = useAuth();
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (authState.user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
