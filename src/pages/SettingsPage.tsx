import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const SettingsPage = () => {
  const { authState } = useAuth();
  const { user } = authState;
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState("sk-•••••••••••••••••••••••••••");

  // Obter iniciais do nome do usuário
  const getInitials = (name: string = "Usuário") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="api">API & Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button size="sm">Alterar foto</Button>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, GIF ou PNG. Máximo 1MB.
              </p>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" />
              <p className="text-sm text-muted-foreground">
                Deixe em branco se não quiser alterar sua senha.
              </p>
            </div>

            <Button type="submit">Salvar alterações</Button>
          </form>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações push</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações de atividades importantes
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Atualizações por email</h3>
                <p className="text-sm text-muted-foreground">
                  Receba emails sobre novos recursos e atualizações
                </p>
              </div>
              <Switch
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Boletim informativo</h3>
                <p className="text-sm text-muted-foreground">
                  Receba nossa newsletter mensal
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Modo escuro</h3>
                <p className="text-sm text-muted-foreground">
                  Ative o modo escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Tema de cores</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm">Padrão</span>
                </div>
                <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span className="text-sm">Roxo</span>
                </div>
                <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm">Verde</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Densidade da interface</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  Compacta
                </Button>
                <Button variant="outline" size="sm" className="justify-start bg-accent">
                  Normal
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Confortável
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Chave da API</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Use esta chave para interagir com nossa API diretamente
              </p>
              <div className="flex space-x-2">
                <Input
                  value={apiKey}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Chave da API copiada para a área de transferência!");
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Integrações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium">GPT-4o</h4>
                      <p className="text-xs text-muted-foreground">
                        Integração com IA para chat e automações
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" fill="currentColor" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium">Google</h4>
                      <p className="text-xs text-muted-foreground">
                        Login com Google e sincronização de calendário
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.111.755-.12 1.035-3.471-.05-6.466-.041-9.98.099-.146.02-.226.175-.183.308.716 2.152 1.412 3.933 2.088 5.881.056.161.243.214.386.126 1.4-.857 2.538-1.597 4.081-2.475.145-.083.358-.044.446.093a1.19 1.19 0 0 1 .11.343c.022.887-.032 3.198.001 5.3.006.353.451.474.844.293 1.628-.747 2.551-1.181 4.166-1.945.43-.206.482-.933.067-.933-.556.001-1.261.283-1.703.041-.164-.09-.262-.442-.262-.442s2.151-1.28 2.836-1.73c.172-.114.354.059.364.294.025 1.3.025 3.009-.004 4.811-.016.984-1.715 2.058-3.225 2.285-.393.059-.836.268-.835.764.001.29.39.708 1.465.932.625.13 1.27.184 1.94.197 3.951.077 6.837-1.921 6.837-1.921s.034 1.59.034 2.215c0 .703-3.203 1.546-7.937 1.546-2.318 0-5.093-.216-6.781-.69-.384-.107-2.082-.55-2.674-1.083-.446-.404-.571-1.322-.53-1.966.026-.384.3-.624.483-.624.214 0 .431.144.543.345.086.154.184.326.23.427.544 1.171 5.327 1.554 7.922 1.555.01-.002 5.52-.098 5.521-1.193v-2.895s-3.413 1.205-7.822 1.343c-1.908.059-3.932-.289-4.01-2.055-.025-.6.28-.934.595-1.189.251-.203.485-.376.752-.5 1.365-.641 4.585-1.424 4.585-1.424s-3.145 1.122-6.115 1.498a.493.493 0 0 1-.569-.33c-1.11-3.67-2.509-8.554-2.509-8.554-3.983-.508-6.661-.887-8.835-.93-1.017-.042-1.347-.591-1.347-1.082C3.557 1.329 4.629 1 6.635 1c8.985 0 17.332 3.57 20.075 4.878.446.216.87.832.87 1.511 0 1.649-1.877 2.483-3.333 2.483-1.226 0-2.146-.64-2.146-1.511 0-.649.969-1.122 1.874-1.302.752-.15 1.09-.38 1.068-.72-.023-.35-.535-.508-.535-.508C20.713 4.517 13.175 1.85 7.046 1.85c-.546 0-.708.108-.708.307 0 .086.06.228.083.388.046.316-.045.514.273.514 2.339 0 11.678 2.171 11.678 2.171L10.836 8.07c-.076.026-.164.124-.236.248-.1.17-.214.604-.173 1.137.093 1.194 1.583 1.276 2.451 1.276 3.487 0 6.416-1.420 6.416-1.42s-.908.803-2.242 1.517c-.613.329-.319 1.342-.326 1.941-.017 1.441.028 3.569.028 3.569l1.469-.673c.324-.15.419-.428.419-.693l-.006-1.077c0-.361.026-.732.026-1.061V4.298c0-.43-.129-.829-.391-1.121-.183-.204-.437-.251-.706-.341-.96-.324-3.197-.913-3.197-.913s5.824 1.345 8.24 2.069c.446.133.666.359.666.621 0 .403-.398.662-.95.798-.644.159-1.203.268-1.27.854-.051.436.715.56 1.407.56.92 0 1.866-.559 1.866-1.583.005-.75-.454-1.45-1.462-1.882zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-3 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 12H9V9h6v9z" fill="currentColor" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium">n8n</h4>
                      <p className="text-xs text-muted-foreground">
                        Automações de fluxo de trabalho
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsPage;
