
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { FallbackState } from "@/components/ui/fallback-state";
import { PageLayout } from "@/layouts";
import { useUserContext } from "@/features/auth/hooks";
import { useLogger } from "@/utils/logger";

const AnalyticsPage = () => {
  // Obter dados do usuário para logging
  const { data: userData } = useUserContext();
  const { user } = userData || {};
  
  // Inicializar logger com nome do componente e usuário atual
  const log = useLogger("AnalyticsPage", user);
  
  // Redirect if user doesn't have admin role
  const redirectComponent = useRoleGuard("admin");
  if (redirectComponent) {
    log.warn("access_denied", "Tentativa de acesso à página de analytics sem permissão");
    return redirectComponent;
  }
  
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, error } = useAnalyticsData();
  
  // Log quando a tab mudar
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    log.info("tab_change", `Tab alterada para ${value}`);
  };
  
  if (isLoading) {
    log.debug("loading", "Carregando dados de analytics");
    return <FallbackState 
      type="loading" 
      title="Carregando análises" 
      message="Processando dados estatísticos..." 
    />;
  }
  
  if (error) {
    log.error("data_load_error", `Erro ao carregar dados: ${String(error)}`, error instanceof Error ? error : undefined);
    return (
      <FallbackState 
        type="error" 
        title="Erro ao carregar os dados de análise"
        message={`Não foi possível processar os dados: ${String(error)}. Tente novamente mais tarde.`}
      />
    );
  }
  
  // Check if data is empty
  if (!data || !data.monthlyData || data.monthlyData.length === 0) {
    log.warn("empty_data", "Nenhum dado de análise disponível");
    return (
      <FallbackState 
        type="empty" 
        title="Sem dados de análise"
        message="Não há dados de análise disponíveis no momento. Aguarde até que novos dados sejam gerados ou entre em contato com o suporte."
      />
    );
  }
  
  log.info("render", "Renderizando página de analytics com dados", { tabsCount: data.monthlyData.length });
  
  return (
    <PageLayout
      title="Analytics"
      description="Visualize dados e métricas da plataforma."
    >
      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuários Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">70</div>
                <p className="text-xs text-muted-foreground">
                  +20% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Novos Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +15% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +5% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Consultorias Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">
                  +25% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Crescimento Anual</CardTitle>
              <CardDescription>
                Evolução mensal de usuários e consultorias
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Consultorias" />
                  <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Usuários" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>
                Análise de usuários por perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#82ca9d" name="Usuários" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Métricas de Engajamento</CardTitle>
              <CardDescription>
                Análise de consultorias realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Consultorias" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AnalyticsPage;
