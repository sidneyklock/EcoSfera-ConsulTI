
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { PasswordValidator } from "./PasswordValidator";
import { toast } from "@/components/ui/sonner";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

/**
 * Componente de formulário de registro
 * Permite criação de conta por email/senha e por Google
 */
export function RegisterForm() {
  const { authState, signUp, signInWithGoogle } = useAuth();
  const { handleSubmit, register, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  
  const password = watch("password", "");

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
    const user = await signUp(email, password, name);
    
    if (user) {
      toast.success("Registro realizado com sucesso! Por favor verifique seu email.");
    }
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

  return (
    <Card className="auth-card animate-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Registrar</CardTitle>
        <CardDescription>
          Crie uma nova conta para acessar o dashboard
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} aria-label="Formulário de registro">
        <CardContent className="space-y-4">
          {/* Alerta de erro */}
          {authState.error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{authState.error}</AlertDescription>
            </Alert>
          )}
          
          {/* Campo de nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="block">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                aria-invalid={!!errors.name}
                {...register("name", { 
                  required: "Nome é obrigatório",
                  minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" }
                })}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          {/* Campo de email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                aria-required="true"
                aria-invalid={!!errors.email}
                {...register("email", { 
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          
          {/* Campo de senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="block">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                className="pl-10"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby="password-validator"
                {...register("password", { required: "Senha é obrigatória" })}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
            <PasswordValidator 
              password={password} 
              onValidationChange={setIsPasswordValid}
            />
          </div>
          
          {/* Botão de registro */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={authState.isLoading || !isPasswordValid}
            aria-busy={authState.isLoading}
          >
            {authState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Aguarde</span>
              </>
            ) : (
              <span>Registrar</span>
            )}
          </Button>
          
          {/* Divisor */}
          <div className="relative my-4" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          
          {/* Botão de login com Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={authState.isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.212 1.387-1.375 3.2-2.163Q10.05 1.85 12 1.85q1.95 0 3.738.775 1.787.775 3.162 2.137 1.375 1.363 2.2 3.188.825 1.825.825 3.9 0 1.5-.387 2.9-.388 1.4-1.113 2.613l3.45 3.45-1.4 1.4-3.45-3.45q-1.225.725-2.6 1.112Q15.05 20.25 13.45 20.25q-3.425 0-5.837-2.4Q5.2 15.45 5.2 12q0-3.45 2.413-5.85Q10.025 3.75 13.45 3.75q1.4 0 2.725.475 1.325.475 2.45 1.35-.65-1.05-1.687-1.738Q15.9 3.15 14.45 3.15q-3.425 0-5.838 2.4Q6.2 7.95 6.2 11.4q0 3.45 2.412 5.85 2.413 2.4 5.838 2.4 3.45 0 5.837-2.4 2.388-2.4 2.388-5.85 0-.75-.15-1.5h-8.1V7.95h11.4q.15.8.225 1.625.075.825.075 1.575 0 2.05-.788 3.887-.787 1.838-2.15 3.2-1.362 1.363-3.187 2.15Q14.05 22 12 22Z"
              />
            </svg>
            <span>Google</span>
          </Button>
        </CardContent>
      </form>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Já possui uma conta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
