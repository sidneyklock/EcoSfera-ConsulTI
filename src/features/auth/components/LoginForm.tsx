
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
 * Componente de formulário de login otimizado
 * Permite autenticação por email/senha e por Google
 */
export function LoginForm() {
  const { signIn, signInWithGoogle, error, isLoading } = useAuth();
  const [isDemoAuthLoading, setIsDemoAuthLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const isProcessing = isLoading || isDemoAuthLoading;

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Validar ao perder o foco para melhor UX
  });

  /**
   * Manipulador de submissão do formulário com feedback visual aprimorado
   */
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setFormSubmitted(true);
      await signIn(data.email, data.password);
    } catch (err) {
      // Error será tratado pelo hook de auth
      console.error("Erro no processo de login:", err);
    } finally {
      setFormSubmitted(false);
    }
  };

  /**
   * Login rápido para ambiente de desenvolvimento com melhor feedback
   */
  const handleDevLogin = async () => {
    try {
      setIsDemoAuthLoading(true);
      toast.loading("Efetuando login de desenvolvimento...", { id: "dev-login" });
      // Usuário e senha temporários para desenvolvimento
      await signIn("dev@example.com", "senha123");
      toast.success("Login de desenvolvimento concluído", { id: "dev-login" });
    } catch (err) {
      toast.error("Falha no login de desenvolvimento", { id: "dev-login" });
    } finally {
      setIsDemoAuthLoading(false);
    }
  };

  /**
   * Login com Google com melhor feedback
   */
  const handleGoogleSignIn = async () => {
    try {
      toast.loading("Preparando autenticação Google...", { id: "google-login" });
      const result = await signInWithGoogle();
      
      if (!result.success) {
        toast.error("Falha ao iniciar login com Google", { id: "google-login" });
      } else {
        toast.success("Redirecionando para Google...", { id: "google-login" });
      }
    } catch (error) {
      toast.error("Erro ao iniciar login com Google", { id: "google-login" });
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Formulário de login" noValidate>
          <CardContent className="space-y-4">
            {/* Alerta de erro */}
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Campo de email */}
            <EmailField control={form.control} name="email" disabled={isProcessing} />
            
            {/* Campo de senha */}
            <PasswordField 
              control={form.control} 
              name="password"
              forgotPasswordLink
              onForgotPasswordClick={navigateToForgotPassword}
              disabled={isProcessing}
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
              aria-label="Entrar com o Google"
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
