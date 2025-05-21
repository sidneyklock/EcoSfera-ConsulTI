
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { Role } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  WebhookKeyManager, 
  AdminLogViewer, 
  UserRoleAssignment, 
  TokenManager, 
  WebhookLogs, 
  AuditLogViewer 
} from "@/features/admin/components";
import { PageLayout } from "@/layouts";
import { adminService } from "../services/adminService";

const AdminPage = () => {
  // Use the role guard hook to protect this page
  const redirectComponent = useRoleGuard("admin" as Role);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Exibe uma mensagem de boas-vindas para o administrador
    toast({
      title: "Área de Administração",
      description: "Bem-vindo(a) à área administrativa. Você tem permissões de administrador.",
    });
    
    // Registrar o acesso na tabela de logs administrativos usando o adminService
    const logAdminAccess = async () => {
      try {
        await adminService.logAdminAction(
          'access_admin_page',
          'admin_page',
          null,
          { page: 'admin', timestamp: new Date().toISOString() }
        );
        console.log('Acesso administrativo registrado com sucesso');
      } catch (error) {
        console.error('Erro ao registrar acesso administrativo:', error);
      }
    };
    
    logAdminAccess();
  }, [toast]);
  
  // If the hook returns a redirect component, render it
  if (redirectComponent) {
    return redirectComponent;
  }

  return (
    <PageLayout
      title="Área de Administração"
      description="Esta página só pode ser acessada por administradores."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários e Roles</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="tokens">Tokens n8n</TabsTrigger>
          <TabsTrigger value="webhook-logs">Logs de Webhook</TabsTrigger>
          <TabsTrigger value="audit-logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="logs">Logs de Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg bg-card shadow">
              <h3 className="font-medium text-lg mb-2">Gerenciamento de Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie contas de usuário, permissões e acesso ao sistema.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card shadow">
              <h3 className="font-medium text-lg mb-2">Configurações do Sistema</h3>
              <p className="text-sm text-muted-foreground">
                Configure parâmetros globais e ajuste comportamentos do sistema.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card shadow">
              <h3 className="font-medium text-lg mb-2">Logs e Auditoria</h3>
              <p className="text-sm text-muted-foreground">
                Monitore atividades do sistema e revise logs de auditoria.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card shadow">
              <h3 className="font-medium text-lg mb-2">Integrações n8n</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie tokens de autenticação e monitore webhooks do n8n.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card shadow">
              <h3 className="font-medium text-lg mb-2">Rastreabilidade de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Visualize o histórico de alterações em tabelas críticas do sistema.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <UserRoleAssignment />
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <WebhookKeyManager />
        </TabsContent>
        
        <TabsContent value="tokens" className="space-y-4">
          <TokenManager />
        </TabsContent>
        
        <TabsContent value="webhook-logs" className="space-y-4">
          <WebhookLogs />
        </TabsContent>
        
        <TabsContent value="audit-logs" className="space-y-4">
          <AuditLogViewer />
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <AdminLogViewer />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AdminPage;
