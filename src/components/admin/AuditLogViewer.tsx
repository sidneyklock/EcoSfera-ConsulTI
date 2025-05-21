
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw, AlertCircle, Eye, Filter } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tipos do Supabase
type AuditLog = Database['public']['Tables']['audit_log']['Row'];

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [tableFilter, setTableFilter] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<string[]>([]);

  // Carregar logs de auditoria
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("audit_log")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (tableFilter) {
        query = query.eq("table_name", tableFilter);
      }

      if (actionFilter) {
        query = query.eq("action", actionFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);

      // Coletar tabelas distintas para o filtro
      const tables = Array.from(new Set(data?.map(log => log.table_name) || []));
      setAvailableTables(tables);
    } catch (err: any) {
      console.error("Erro ao carregar logs:", err);
      setError(err.message || "Erro ao carregar logs de auditoria");
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os logs de auditoria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar logs na montagem do componente
  useEffect(() => {
    fetchLogs();
  }, [tableFilter, actionFilter]);

  // Formatar data e hora
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    } catch (e) {
      return dateString;
    }
  };

  // Formatar dados JSON para exibição
  const formatJsonData = (data: any) => {
    if (!data) return "N/A";
    
    try {
      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }
      return String(data);
    } catch (e) {
      return "Erro ao formatar dados";
    }
  };

  // Obter resumo das alterações
  const getChangeSummary = (log: AuditLog) => {
    if (log.action === "INSERT") {
      return "Registro criado";
    } else if (log.action === "DELETE") {
      return "Registro excluído";
    } else if (log.action === "UPDATE") {
      try {
        const oldData = log.old_data || {};
        const newData = log.new_data || {};
        const changedFields = Object.keys(newData).filter(key => 
          JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])
        );
        
        if (changedFields.length === 0) return "Nenhuma alteração detectada";
        if (changedFields.length === 1) return `Campo alterado: ${changedFields[0]}`;
        return `${changedFields.length} campos alterados`;
      } catch (e) {
        return "Alterações realizadas";
      }
    }
    return log.action;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Logs de Auditoria</CardTitle>
          <CardDescription>
            Registro de alterações em tabelas críticas do sistema
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchLogs()} 
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

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <div className="w-48">
            <Select value={tableFilter || ''} onValueChange={(value) => setTableFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as tabelas</SelectItem>
                {availableTables.map(table => (
                  <SelectItem key={table} value={table}>{table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Select value={actionFilter || ''} onValueChange={(value) => setActionFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as ações</SelectItem>
                <SelectItem value="INSERT">INSERT</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela de logs */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Resumo</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    {loading ? "Carregando logs..." : "Nenhum log de auditoria encontrado"}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{log.table_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action === "INSERT"
                          ? "bg-green-100 text-green-800"
                          : log.action === "DELETE"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {getChangeSummary(log)}
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
                            <DialogTitle>Detalhes da Alteração</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium mb-1">Data/Hora</h3>
                                <p className="text-sm">{formatDateTime(selectedLog?.timestamp || '')}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium mb-1">Tabela</h3>
                                <p className="text-sm">{selectedLog?.table_name}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-1">Ação</h3>
                              <p className="text-sm">{selectedLog?.action}</p>
                            </div>
                            
                            {selectedLog?.old_data && (
                              <div>
                                <h3 className="text-sm font-medium mb-1">Dados Anteriores</h3>
                                <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                                  {formatJsonData(selectedLog.old_data)}
                                </pre>
                              </div>
                            )}
                            
                            {selectedLog?.new_data && (
                              <div>
                                <h3 className="text-sm font-medium mb-1">Dados Novos</h3>
                                <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                                  {formatJsonData(selectedLog.new_data)}
                                </pre>
                              </div>
                            )}
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
