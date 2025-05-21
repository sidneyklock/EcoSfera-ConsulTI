
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
