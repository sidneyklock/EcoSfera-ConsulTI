
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Role } from "@/types";
import { useSecureContextStore } from "@/stores/secureContextStore";

export const UserRoleAssignment = () => {
  // Updated to use authStore directly which has the solutionId
  const { solutionId, isLoading } = useAuthStore();
  const { assignUserRole } = useSecureContextStore();
  const [userEmail, setUserEmail] = useState<string>("sidney.klock@gmail.com");
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [isAssigning, setIsAssigning] = useState(false);

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
      setIsAssigning(true);
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
    } finally {
      setIsAssigning(false);
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
      setIsAssigning(true);
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
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-card border-b">
        <CardTitle>Atribuição de Papel</CardTitle>
        <CardDescription>Atribua papéis aos usuários na solução atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <label htmlFor="userEmail" className="text-sm font-medium">
            E-mail do Usuário
          </label>
          <Input
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="E-mail do usuário"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Papel
          </label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Selecione um papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {solutionId ? (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            ID da Solução: <span className="font-mono">{solutionId}</span>
          </div>
        ) : (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Nenhuma solução selecionada
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <Button 
          onClick={handleAssignRole} 
          disabled={isLoading || isAssigning || !solutionId} 
          className="w-full"
        >
          {isAssigning ? "Atribuindo..." : "Atribuir Papel"}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleAssignAdminToSidney} 
          disabled={isLoading || isAssigning || !solutionId} 
          className="w-full"
        >
          Atribuir Admin a sidney.klock@gmail.com
        </Button>
      </CardFooter>
    </Card>
  );
};
