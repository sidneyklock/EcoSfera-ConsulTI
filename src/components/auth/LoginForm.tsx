
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";

export const LoginForm = () => {
  const { authState, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleDevLogin = async () => {
    // Usuário e senha temporários para desenvolvimento - usando um email existente
    await signIn("sidney.klock@gmail.com", "senha123");
  };

  return (
    <Card className="auth-card animate-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Faça login em sua conta para acessar o dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {authState.error && (
            <Alert variant="destructive">
              <AlertDescription>{authState.error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={authState.isLoading}
          >
            {authState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          
          {/* Botão de login para desenvolvimento */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-muted-foreground/50"
            onClick={handleDevLogin}
            disabled={authState.isLoading}
          >
            Login Rápido (Desenvolvimento)
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={authState.isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="currentColor"
                d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.212 1.387-1.375 3.2-2.163Q10.05 1.85 12 1.85q1.95 0 3.738.775 1.787.775 3.162 2.137 1.375 1.363 2.2 3.188.825 1.825.825 3.9 0 1.5-.387 2.9-.388 1.4-1.113 2.613l3.45 3.45-1.4 1.4-3.45-3.45q-1.225.725-2.6 1.112Q15.05 20.25 13.45 20.25q-3.425 0-5.837-2.4Q5.2 15.45 5.2 12q0-3.45 2.413-5.85Q10.025 3.75 13.45 3.75q1.4 0 2.725.475 1.325.475 2.45 1.35-.65-1.05-1.687-1.738Q15.9 3.15 14.45 3.15q-3.425 0-5.838 2.4Q6.2 7.95 6.2 11.4q0 3.45 2.412 5.85 2.413 2.4 5.838 2.4 3.45 0 5.837-2.4 2.388-2.4 2.388-5.85 0-.75-.15-1.5h-8.1V7.95h11.4q.15.8.225 1.625.075.825.075 1.575 0 2.05-.788 3.887-.787 1.838-2.15 3.2-1.362 1.363-3.187 2.15Q14.05 22 12 22Z"
              />
            </svg>
            Google
          </Button>
        </CardContent>
      </form>
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
};
