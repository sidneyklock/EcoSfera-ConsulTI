
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface AdminLog {
  id: string;
  user_id: string;
  action: string;
  entity_table: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

export const AdminLogViewer = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, { email: string }>>({});

  // Carregar logs de administrador
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);

      // Coletar IDs de usuários únicos
      const userIds = Array.from(new Set(data?.map(log => log.user_id) || []));
      
      // Buscar detalhes de usuários
      if (userIds.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email")
          .in("id", userIds);

        if (!userError && userData) {
          const userMap: Record<string, { email: string }> = {};
          userData.forEach(user => {
            userMap[user.id] = { email: user.email };
          });
          setUserDetails(userMap);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar logs:", err);
      setError(err.message || "Erro ao carregar logs de administrador");
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os logs de administrador",
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

  // Obter email do usuário pelo ID
  const getUserEmail = (userId: string) => {
    return userDetails[userId]?.email || userId;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Logs de Administrador</CardTitle>
          <CardDescription>
            Registro de ações administrativas no sistema
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
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    {loading ? "Carregando logs..." : "Nenhum log de administrador encontrado"}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {getUserEmail(log.user_id)}
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {log.action.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>{log.entity_table}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      <span title={formatDetails(log.details)}>
                        {formatDetails(log.details).substring(0, 50)}
                        {formatDetails(log.details).length > 50 ? "..." : ""}
                      </span>
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
