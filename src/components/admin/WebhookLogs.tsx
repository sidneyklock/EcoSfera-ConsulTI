
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw, AlertCircle, Eye } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface WebhookLog {
  id: string;
  execution_id: string;
  user_id: string;
  webhook_token_id: string;
  request_data: any;
  response_data: any;
  ip_address: string | null;
  status: string;
  execution_timestamp: string;
}

interface TokenDetail {
  name: string;
}

export const WebhookLogs = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [tokenDetails, setTokenDetails] = useState<Record<string, TokenDetail>>({});

  // Carregar logs de webhook
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("webhook_logs")
        .select("*")
        .order("execution_timestamp", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);

      // Coletar IDs de tokens únicos
      const tokenIds = Array.from(new Set(data?.map(log => log.webhook_token_id).filter(Boolean) || []));
      
      // Buscar detalhes dos tokens
      if (tokenIds.length > 0) {
        const { data: tokenData, error: tokenError } = await supabase
          .from("webhook_tokens")
          .select("id, name")
          .in("id", tokenIds);

        if (!tokenError && tokenData) {
          const tokenMap: Record<string, TokenDetail> = {};
          tokenData.forEach(token => {
            tokenMap[token.id] = { name: token.name };
          });
          setTokenDetails(tokenMap);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar logs:", err);
      setError(err.message || "Erro ao carregar logs de webhook");
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os logs de webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar logs na montagem do componente
  useEffect(() => {
    fetchLogs();
  }, []);

  // Formatar detalhes do log para exibição
  const formatDetails = (details: any) => {
    if (!details) return "N/A";
    
    try {
      if (typeof details === 'object') {
        return JSON.stringify(details, null, 2);
      }
      return String(details);
    } catch (e) {
      return "Erro ao formatar detalhes";
    }
  };

  // Formatar data e hora
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    } catch (e) {
      return dateString;
    }
  };

  // Obter nome do token pelo ID
  const getTokenName = (tokenId: string) => {
    return tokenDetails[tokenId]?.name || "Token desconhecido";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Logs de Webhooks</CardTitle>
          <CardDescription>
            Registro de execuções de webhooks do n8n
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 p-4 mb-4 text-red-800 bg-red-50 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Tabela de logs */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Execution ID</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    {loading ? "Carregando logs..." : "Nenhum log de webhook encontrado"}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(log.execution_timestamp)}
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[100px]">
                      {log.execution_id}
                    </TableCell>
                    <TableCell>
                      {log.webhook_token_id ? getTokenName(log.webhook_token_id) : "Sistema"}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {log.status === "success" ? "Sucesso" : "Erro"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Execução</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <h3 className="text-sm font-medium mb-1">Dados da Requisição</h3>
                              <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                                {formatDetails(log.request_data)}
                              </pre>
                            </div>
                            {log.response_data && (
                              <div>
                                <h3 className="text-sm font-medium mb-1">Dados da Resposta</h3>
                                <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                                  {formatDetails(log.response_data)}
                                </pre>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium mb-1">ID de Execução</h3>
                                <p className="text-sm font-mono">{log.execution_id}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium mb-1">Data/Hora</h3>
                                <p className="text-sm">{formatDateTime(log.execution_timestamp)}</p>
                              </div>
                            </div>
                          </div>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Fechar</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
