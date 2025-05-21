
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Processar o callback OAuth
    const handleAuthCallback = async () => {
      try {
        console.log("Processando callback de autenticação...");
        
        // Obter parâmetros da URL para debugging
        const params = new URLSearchParams(window.location.search);
        console.log("Parâmetros da URL:", Object.fromEntries(params.entries()));
        
        // Verificar a sessão do Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro na autenticação:", error);
          toast.error("Erro na autenticação: " + error.message);
          navigate("/login");
          return;
        }
        
        if (data.session) {
          console.info("Login realizado com sucesso:", data.session.user);
          toast.success("Login realizado com sucesso!");
          navigate("/dashboard");
        } else {
          console.error("Nenhuma sessão encontrada no retorno do OAuth");
          toast.error("Falha ao obter sessão");
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro no processamento de autenticação:", err);
        toast.error("Erro no processamento de autenticação");
        navigate("/login");
      }
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
