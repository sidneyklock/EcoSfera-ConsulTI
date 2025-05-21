
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, RecycleIcon, Droplets, Wind, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

const sustainabilityData = [
  { name: 'Economia de Energia', value: 400 },
  { name: 'Redução de Resíduos', value: 300 },
  { name: 'Economia de Água', value: 300 },
  { name: 'Redução de Carbono', value: 200 },
];

const initiativesList = [
  { 
    id: 1, 
    title: "Infraestrutura Verde", 
    description: "Adoção de servidores eficientes e uso de energia renovável",
    icon: Leaf,
    status: "completed" 
  },
  { 
    id: 2, 
    title: "Gestão de Resíduos Eletrônicos", 
    description: "Programa de reciclagem e descarte correto de equipamentos",
    icon: RecycleIcon,
    status: "in-progress" 
  },
  { 
    id: 3, 
    title: "Conservação de Água", 
    description: "Redução do uso de água e sistemas de reutilização",
    icon: Droplets,
    status: "planned" 
  },
  { 
    id: 4, 
    title: "Compensação de Carbono", 
    description: "Projetos de reflorestamento e investimento em créditos de carbono",
    icon: Wind,
    status: "in-progress" 
  },
];

const SustainabilityPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulated data fetch
    console.log("Loading sustainability data...");
  }, []);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-300";
      case 'in-progress':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'planned':
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed':
        return "Concluído";
      case 'in-progress':
        return "Em Andamento";
      case 'planned':
        return "Planejado";
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sustentabilidade</h1>
        <p className="text-muted-foreground mt-2">
          Conheça nossas iniciativas e impacto ambiental na EcoSfera ConsulTI.
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="initiatives">Iniciativas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Economia de Energia
                </CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <p className="text-xs text-muted-foreground">
                  +10% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Redução de Resíduos
                </CardTitle>
                <RecycleIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38%</div>
                <p className="text-xs text-muted-foreground">
                  +15% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Economia de Água
                </CardTitle>
                <Droplets className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28%</div>
                <p className="text-xs text-muted-foreground">
                  +8% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Redução de Carbono
                </CardTitle>
                <Wind className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Impacto Ambiental</CardTitle>
              <CardDescription>
                Distribuição das iniciativas de sustentabilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={sustainabilityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {sustainabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="initiatives" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {initiativesList.map((initiative) => (
              <Card key={initiative.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <initiative.icon className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg font-semibold">{initiative.title}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusClass(initiative.status)}`}>
                    {getStatusText(initiative.status)}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{initiative.description}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => toast.success(`Detalhes da iniciativa "${initiative.title}" carregados`)}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sugerir Iniciativa</CardTitle>
              <CardDescription>
                Tem ideias para novas iniciativas de sustentabilidade? Compartilhe conosco.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/chat")}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Sugerir nova iniciativa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Sustentabilidade</CardTitle>
              <CardDescription>
                Acesse relatórios detalhados sobre nossas práticas sustentáveis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="font-medium">Relatório Anual 2024</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visão geral completa das nossas iniciativas e resultados.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Relatório aberto em uma nova guia")}>
                    Visualizar PDF
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="font-medium">Balanço de Carbono 2024</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise detalhada da nossa pegada de carbono.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Relatório aberto em uma nova guia")}>
                    Visualizar PDF
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="font-medium">Relatório de Recursos Hídricos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise do consumo e economia de água.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Relatório aberto em uma nova guia")}>
                    Visualizar PDF
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="font-medium">Impacto Ambiental de Datacenters</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Estudo sobre o impacto e otimização energética.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Relatório aberto em uma nova guia")}>
                    Visualizar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SustainabilityPage;
