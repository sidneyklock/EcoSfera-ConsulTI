
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";

import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { AuthDivider } from "./AuthDivider";
import { useAuthService } from "../hooks/useAuthService";

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
  const { signIn, signInWithGoogle, error, isLoading } = useAuthService();
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

  return (
    <Card className="auth-card animate-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Faça login em sua conta para acessar o dashboard
        </CardDescription>
      </CardHeader>
      
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
              onForgotPasswordClick={() => navigate("/forgot-password")}
            />
            
            {/* Botão de login */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
              aria-busy={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Aguarde</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
            
            {/* Botão de login para desenvolvimento */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-muted-foreground/50"
              onClick={handleDevLogin}
              disabled={isProcessing}
            >
              Login Rápido (Desenvolvimento)
            </Button>

            <AuthDivider />
            
            {/* Botão de login com Google */}
            <GoogleLoginButton 
              onClick={signInWithGoogle} 
              disabled={isProcessing} 
            />
          </CardContent>
        </form>
      </Form>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Não possui uma conta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate("/register")}
          >
            Registrar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
