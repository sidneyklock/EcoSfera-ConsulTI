
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Check, X } from "lucide-react";

interface WebhookKey {
  id: string;
  name: string;
  api_key: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export const WebhookKeyManager = () => {
  const [webhookKeys, setWebhookKeys] = useState<WebhookKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyDescription, setNewKeyDescription] = useState("");

  // Carregar chaves de webhook existentes
  useEffect(() => {
    const fetchWebhookKeys = async () => {
      try {
        const { data, error } = await supabase
          .from("webhook_keys")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWebhookKeys(data || []);
      } catch (error) {
        console.error("Erro ao carregar chaves de webhook:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as chaves de webhook",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWebhookKeys();
  }, []);

  // Gerar uma nova chave de webhook
  const generateWebhookKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe um nome para a chave de webhook",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Gerar uma chave aleatória
      const apiKey = Array(32)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
      
      // Registrar a função que será chamada para log de auditoria
      const logAction = async (entityId: string) => {
        await supabase.rpc('log_admin_action', {
          action: 'create_webhook_key',
          entity_table: 'webhook_keys',
          entity_id: entityId,
          details: { key_name: newKeyName }
        });
      };

      // Criar a nova chave
      const { data, error } = await supabase
        .from("webhook_keys")
        .insert({
          name: newKeyName,
          api_key: apiKey,
          description: newKeyDescription || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Adicionar à lista local
      setWebhookKeys([data, ...webhookKeys]);
      
      // Registrar ação
      if (data?.id) {
        await logAction(data.id);
      }
      
      // Limpar formulário
      setNewKeyName("");
      setNewKeyDescription("");
      
      toast({
        title: "Chave criada",
        description: "A chave de webhook foi criada com sucesso",
      });
      
    } catch (error) {
      console.error("Erro ao criar chave de webhook:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a chave de webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remover uma chave de webhook
  const deleteWebhookKey = async (id: string, name: string) => {
    try {
      setLoading(true);
      
      // Registrar a função que será chamada para log de auditoria
      await supabase.rpc('log_admin_action', {
        action: 'delete_webhook_key',
        entity_table: 'webhook_keys',
        entity_id: id,
        details: { key_name: name }
      });
      
      // Excluir a chave
      const { error } = await supabase
        .from("webhook_keys")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Atualizar lista local
      setWebhookKeys(webhookKeys.filter(key => key.id !== id));
      
      toast({
        title: "Chave removida",
        description: "A chave de webhook foi removida com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover chave de webhook:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a chave de webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Alternar status de uma chave (ativar/desativar)
  const toggleKeyStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      setLoading(true);
      
      // Registrar a ação no log de auditoria
      await supabase.rpc('log_admin_action', {
        action: currentStatus ? 'disable_webhook_key' : 'enable_webhook_key',
        entity_table: 'webhook_keys',
        entity_id: id,
        details: { key_name: name, new_status: !currentStatus }
      });
      
      // Atualizar o status da chave
      const { error } = await supabase
        .from("webhook_keys")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      // Atualizar lista local
      setWebhookKeys(
        webhookKeys.map(key =>
          key.id === id ? { ...key, is_active: !currentStatus } : key
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `Chave ${!currentStatus ? "ativada" : "desativada"} com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status da chave:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da chave",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Chaves de Webhook</CardTitle>
        <CardDescription>
          Crie e gerencie chaves de API para acesso automático ao sistema via webhooks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Formulário para criar nova chave */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome da chave"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Descrição (opcional)"
                value={newKeyDescription}
                onChange={(e) => setNewKeyDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              onClick={generateWebhookKey} 
              disabled={loading || !newKeyName.trim()}
              className="w-full md:w-auto self-end"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Gerar Nova Chave
            </Button>
          </div>

          {/* Lista de chaves existentes */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Chave de API</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhookKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      {loading ? "Carregando chaves..." : "Nenhuma chave de webhook encontrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  webhookKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div className="font-medium">{key.name}</div>
                        <div className="text-sm text-muted-foreground">{key.description || "Sem descrição"}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {key.api_key}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {key.is_active ? "Ativa" : "Inativa"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyStatus(key.id, key.is_active, key.name)}
                            disabled={loading}
                          >
                            {key.is_active ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteWebhookKey(key.id, key.name)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
