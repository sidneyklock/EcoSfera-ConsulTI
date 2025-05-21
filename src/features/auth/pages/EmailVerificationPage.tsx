import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const EmailVerificationPage = () => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value.length !== 6) {
      toast.error("Por favor, insira o código completo de 6 dígitos.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulação de verificação - aqui seria integrado com a lógica real de verificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("E-mail verificado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao verificar o código. Tente novamente.");
      console.error("Erro na verificação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    // Lógica para reenviar o código
    toast.success("Um novo código foi enviado para o seu e-mail.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verificação de E-mail</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Insira o código de verificação enviado para{" "}
            <span className="font-medium">{email || "seu e-mail"}</span>
          </p>
        </div>
        
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            O código de verificação expira em 15 minutos. 
            Recomendamos que você o utilize imediatamente após o recebimento.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleVerification} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={setValue}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={value.length !== 6 || isSubmitting}
          >
            {isSubmitting ? "Verificando..." : "Verificar"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <button 
              type="button"
              onClick={handleResendCode}
              className="text-primary hover:underline font-medium"
            >
              Reenviar código
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
