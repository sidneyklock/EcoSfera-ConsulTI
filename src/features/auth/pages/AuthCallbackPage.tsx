import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Processar o callback OAuth
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro na autenticação:", error.message);
        toast.error("Erro na autenticação: " + error.message);
        navigate("/login");
        return;
      }
      
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processando autenticação...</h2>
        <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
