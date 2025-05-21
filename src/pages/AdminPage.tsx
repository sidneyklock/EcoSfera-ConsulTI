
const AdminPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Área de Administração</h1>
      <p className="text-muted-foreground">
        Esta página só pode ser acessada por administradores.
      </p>
      
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
      </div>
    </div>
  );
};

export default AdminPage;
