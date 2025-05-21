
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";

import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { AuthDivider } from "./AuthDivider";
import { FormActions } from "./FormActions";
import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";
import { useAuth } from "../hooks";
import { toast } from "@/components/ui/sonner";

// Schema para validação do formulário
const loginFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormInputs = z.infer<typeof loginFormSchema>;

/**
 * Componente de formulário de login
 * Permite autenticação por email/senha e por Google
 */
export function LoginForm() {
  const { signIn, signInWithGoogle, error, isLoading } = useAuth();
  const [isDemoAuthLoading, setIsDemoAuthLoading] = useState(false);
  const navigate = useNavigate();
  
  const isProcessing = isLoading || isDemoAuthLoading;

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Manipulador de submissão do formulário
   */
  const onSubmit = async (data: LoginFormInputs) => {
    await signIn(data.email, data.password);
  };

  /**
   * Login rápido para ambiente de desenvolvimento
   */
  const handleDevLogin = async () => {
    try {
      setIsDemoAuthLoading(true);
      // Usuário e senha temporários para desenvolvimento
      await signIn("dev@example.com", "senha123");
    } finally {
      setIsDemoAuthLoading(false);
    }
  };

  /**
   * Login com Google
   */
  const handleGoogleSignIn = () => {
    signInWithGoogle().catch(error => {
      toast.error("Erro ao iniciar login com Google");
    });
  };

  /**
   * Navegação para registro
   */
  const navigateToRegister = () => navigate("/register");

  /**
   * Navegação para recuperação de senha
   */
  const navigateToForgotPassword = () => navigate("/forgot-password");

  return (
    <Card className="auth-card animate-in">
      <AuthHeader 
        title="Entrar" 
        description="Faça login em sua conta para acessar o dashboard" 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Formulário de login">
          <CardContent className="space-y-4">
            {/* Alerta de erro */}
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Campo de email */}
            <EmailField control={form.control} name="email" />
            
            {/* Campo de senha */}
            <PasswordField 
              control={form.control} 
              name="password"
              forgotPasswordLink
              onForgotPasswordClick={navigateToForgotPassword}
            />
            
            {/* Botões de ação */}
            <FormActions 
              isLoading={isProcessing}
              submitLabel="Entrar"
              devLoginEnabled
              onDevLogin={handleDevLogin}
            />

            <AuthDivider />
            
            {/* Botão de login com Google */}
            <GoogleLoginButton 
              onClick={handleGoogleSignIn} 
              disabled={isProcessing} 
            />
          </CardContent>
        </form>
      </Form>
      
      <CardFooter>
        <AuthFooter 
          questionText="Não possui uma conta?"
          actionText="Registrar"
          onAction={navigateToRegister}
        />
      </CardFooter>
    </Card>
  );
}
