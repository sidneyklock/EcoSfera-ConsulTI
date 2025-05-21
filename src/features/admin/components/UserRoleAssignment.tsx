import { useState } from "react";
import { useSecureContextStore } from "@/stores/secureContextStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Role } from "@/types";

export const UserRoleAssignment = () => {
  const { solutionId, assignUserRole, loading } = useSecureContextStore();
  const [userEmail, setUserEmail] = useState<string>("sidney.klock@gmail.com");
  const [selectedRole, setSelectedRole] = useState<Role>("admin");

  const handleAssignRole = async () => {
    if (!solutionId) {
      toast({
        title: "Erro",
        description: "Nenhuma solução ativa selecionada",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignUserRole(userEmail, selectedRole, solutionId);
      toast({
        title: "Sucesso",
        description: `Papel ${selectedRole} atribuído ao usuário ${userEmail}`,
      });
    } catch (error) {
      console.error("Erro ao atribuir papel:", error);
      toast({
        title: "Erro",
        description: "Falha ao atribuir papel ao usuário",
        variant: "destructive",
      });
    }
  };

  // Pré-configuração para o usuário especificado
  const handleAssignAdminToSidney = async () => {
    if (!solutionId) {
      toast({
        title: "Erro",
        description: "Nenhuma solução ativa selecionada",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignUserRole("sidney.klock@gmail.com", "admin", solutionId);
      toast({
        title: "Sucesso",
        description: "Papel 'admin' atribuído ao usuário sidney.klock@gmail.com",
      });
    } catch (error) {
      console.error("Erro ao atribuir papel:", error);
      toast({
        title: "Erro",
        description: "Falha ao atribuir papel ao usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Atribuição de Papel</CardTitle>
        <CardDescription>Atribua papéis aos usuários na solução atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="userEmail" className="text-sm font-medium">
            E-mail do Usuário
          </label>
          <Input
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="E-mail do usuário"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Papel
          </label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecione um papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {solutionId ? (
          <div className="text-sm text-muted-foreground">
            ID da Solução: <span className="font-mono">{solutionId}</span>
          </div>
        ) : (
          <div className="text-sm text-destructive">Nenhuma solução selecionada</div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleAssignRole} disabled={loading || !solutionId} className="w-full">
          Atribuir Papel
        </Button>
        <Button 
          variant="outline" 
          onClick={handleAssignAdminToSidney} 
          disabled={loading || !solutionId} 
          className="w-full"
        >
          Atribuir Admin a sidney.klock@gmail.com
        </Button>
      </CardFooter>
    </Card>
  );
};
