
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { AuthDivider } from "./AuthDivider";
import { FormActions } from "./FormActions";
import { PasswordValidator } from "./PasswordValidator";
import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";
import { useAuth } from "../hooks";
import { toast } from "@/components/ui/sonner";

// Schema para validação do formulário
const registerFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormInputs = z.infer<typeof registerFormSchema>;

/**
 * Componente de formulário de registro
 * Permite criação de conta por email/senha e por Google
 */
export function RegisterForm() {
  const { signUp, signInWithGoogle, error, isLoading } = useAuth();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password", "");

  /**
   * Manipulador de submissão do formulário
   */
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    // Prevenir submissão se senha não for válida
    if (!isPasswordValid) {
      toast.error("A senha não atende aos requisitos de segurança");
      return;
    }
    
    const { email, password, name } = data;
    await signUp(email, password, name);
  };

  /**
   * Login com Google
   */
  const handleGoogleLogin = async () => {
    const { success } = await signInWithGoogle();
    
    if (!success) {
      toast.error("Falha ao iniciar login com Google");
    }
  };

  /**
   * Navegação para login
   */
  const navigateToLogin = () => navigate("/login");

  return (
    <Card className="auth-card animate-in">
      <AuthHeader
        title="Registrar"
        description="Crie uma nova conta para acessar o dashboard"
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Formulário de registro">
          <CardContent className="space-y-4">
            {/* Alerta de erro */}
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Campo de nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    <FormControl>
                      <Input
                        placeholder="Seu nome"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Campo de email */}
            <EmailField control={form.control} name="email" />
            
            {/* Campo de senha */}
            <PasswordField 
              control={form.control} 
              name="password"
            />
            
            {/* Validador de senha */}
            <PasswordValidator 
              password={password} 
              onValidationChange={setIsPasswordValid}
            />
            
            {/* Botões de ação */}
            <FormActions 
              isLoading={isLoading}
              submitLabel="Registrar"
              disabled={!isPasswordValid}
            />

            <AuthDivider />
            
            {/* Botão de login com Google */}
            <GoogleLoginButton 
              onClick={handleGoogleLogin} 
              disabled={isLoading} 
            />
          </CardContent>
        </form>
      </Form>
      
      <CardFooter>
        <AuthFooter 
          questionText="Já possui uma conta?"
          actionText="Entrar"
          onAction={navigateToLogin}
        />
      </CardFooter>
    </Card>
  );
}
