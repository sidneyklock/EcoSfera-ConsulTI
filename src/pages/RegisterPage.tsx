
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const { authState } = useAuth();
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (authState.user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
