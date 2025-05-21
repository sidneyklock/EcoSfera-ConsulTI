
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { user } = useAuth();
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (user) {
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
