import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const data = [
  { name: "Jan", value: 5, users: 10 },
  { name: "Feb", value: 8, users: 15 },
  { name: "Mar", value: 12, users: 18 },
  { name: "Apr", value: 19, users: 25 },
  { name: "May", value: 15, users: 30 },
  { name: "Jun", value: 24, users: 32 },
  { name: "Jul", value: 35, users: 45 },
  { name: "Aug", value: 30, users: 50 },
  { name: "Sep", value: 42, users: 55 },
  { name: "Oct", value: 38, users: 48 },
  { name: "Nov", value: 45, users: 60 },
  { name: "Dec", value: 55, users: 70 },
];

const AnalyticsPage = () => {
  // Redirect if user doesn't have admin role
  const redirectComponent = useRoleGuard("admin");
  if (redirectComponent) {
    return redirectComponent;
  }
  
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Simulated analytics data fetch
    console.log("Fetching analytics data...");
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Visualize dados e métricas da plataforma.
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                <LineChart data={data}>
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
                <BarChart data={data}>
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
                <BarChart data={data}>
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
    </div>
  );
};

export default AnalyticsPage;
