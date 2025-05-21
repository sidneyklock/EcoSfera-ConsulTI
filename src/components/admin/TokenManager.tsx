import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Check, X, Copy, Clock } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

// Usar o tipo da tabela webhook_tokens do Supabase
type WebhookToken = Database['public']['Tables']['webhook_tokens']['Row'];

export const TokenManager = () => {
  const [tokens, setTokens] = useState<WebhookToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenDescription, setNewTokenDescription] = useState("");
  const [expiryDays, setExpiryDays] = useState(30); // Padrão: 30 dias

  // Carregar tokens existentes
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data, error } = await supabase
          .from("webhook_tokens")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTokens(data || []);
      } catch (error) {
        console.error("Erro ao carregar tokens:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os tokens",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Gerar um novo token
  const generateToken = async () => {
    if (!newTokenName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe um nome para o token",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Gerar token aleatório
      const token = Array(48)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
      
      // Calcular data de expiração (se aplicável)
      let expiresAt = null;
      if (expiryDays > 0) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + expiryDays);
        expiresAt = expDate.toISOString();
      }
      
      // Registrar a função que será chamada para log de auditoria
      const logAction = async (entityId: string) => {
        await supabase.rpc('log_admin_action', {
          action: 'create_webhook_token',
          entity_table: 'webhook_tokens',
          entity_id: entityId,
          details: { token_name: newTokenName }
        });
      };

      // Criar o novo token
      const { data, error } = await supabase
        .from("webhook_tokens")
        .insert({
          name: newTokenName,
          token: token,
          description: newTokenDescription || null,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) throw error;
      
      // Adicionar à lista local
      if (data) {
        setTokens([data, ...tokens]);
        
        // Registrar ação
        await logAction(data.id);
      }
      
      // Limpar formulário
      setNewTokenName("");
      setNewTokenDescription("");
      
      toast({
        title: "Token criado",
        description: "O token foi criado com sucesso",
      });
      
    } catch (error) {
      console.error("Erro ao criar token:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remover um token
  const deleteToken = async (id: string, name: string) => {
    try {
      setLoading(true);
      
      // Registrar a função que será chamada para log de auditoria
      await supabase.rpc('log_admin_action', {
        action: 'delete_webhook_token',
        entity_table: 'webhook_tokens',
        entity_id: id,
        details: { token_name: name }
      });
      
      // Excluir o token
      const { error } = await supabase
        .from("webhook_tokens")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Atualizar lista local
      setTokens(tokens.filter(token => token.id !== id));
      
      toast({
        title: "Token removido",
        description: "O token foi removido com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover token:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Alternar status de um token (ativar/desativar)
  const toggleTokenStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      setLoading(true);
      
      // Registrar a ação no log de auditoria
      await supabase.rpc('log_admin_action', {
        action: currentStatus ? 'disable_webhook_token' : 'enable_webhook_token',
        entity_table: 'webhook_tokens',
        entity_id: id,
        details: { token_name: name, new_status: !currentStatus }
      });
      
      // Atualizar o status do token
      const { error } = await supabase
        .from("webhook_tokens")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      // Atualizar lista local
      setTokens(
        tokens.map(token =>
          token.id === id ? { ...token, is_active: !currentStatus } : token
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `Token ${!currentStatus ? "ativado" : "desativado"} com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status do token:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Copiar token para a área de transferência
  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Token copiado",
      description: "Token copiado para a área de transferência",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Tokens para n8n</CardTitle>
        <CardDescription>
          Crie e gerencie tokens de autenticação para webhooks do n8n
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Formulário para criar novo token */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nome do token"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Descrição (opcional)"
                value={newTokenDescription}
                onChange={(e) => setNewTokenDescription(e.target.value)}
                disabled={loading}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="365"
                  placeholder="Dias para expirar (0 = sem expiração)"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value) || 0)}
                  disabled={loading}
                />
                <Button 
                  onClick={generateToken} 
                  disabled={loading || !newTokenName.trim()}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Gerar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de tokens existentes */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {loading ? "Carregando tokens..." : "Nenhum token encontrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.description || "Sem descrição"}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[150px]">
                            {token.token}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToken(token.token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {token.expires_at ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(token.expires_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sem expiração</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          token.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {token.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleTokenStatus(token.id, token.is_active, token.name)}
                            disabled={loading}
                          >
                            {token.is_active ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteToken(token.id, token.name)}
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
