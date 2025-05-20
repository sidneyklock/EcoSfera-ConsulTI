
import { useEffect } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { authState } = useAuth();
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (authState.user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
