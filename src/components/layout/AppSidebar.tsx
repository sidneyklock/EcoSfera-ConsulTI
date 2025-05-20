
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  BarChart,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Role } from "@/types";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
};

export const AppSidebar = () => {
  const { authState, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Itens de navegação com controle de acesso por role
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["user", "admin"],
    },
    {
      title: "Usuários",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart,
      roles: ["admin"],
    },
    {
      title: "Chat IA",
      href: "/chat",
      icon: MessageSquare,
      roles: ["user", "admin"],
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
      roles: ["user", "admin"],
    },
  ];

  // Filtrar itens baseado na role do usuário atual
  const filteredItems = navItems.filter(
    (item) => authState.user && item.roles.includes(authState.user.role)
  );

  // Verifica se o item atual é o ativo
  const isActive = (href: string) => location.pathname === href;

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
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Menu className="h-5 w-5" />
        ) : (
          <X className="h-5 w-5" />
        )}
      </Button>

      <Sidebar
        defaultCollapsed={false}
        collapsible="icon"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        className={cn(
          "border-r h-screen fixed left-0 top-0 z-40 transition-all duration-300",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "w-64"
        )}
      >
        <SidebarHeader className="py-4 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-2">
              S
            </div>
            {!collapsed && (
              <div className="font-semibold text-xl">SaaS Platform</div>
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-2">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="mt-auto">
          {authState.user && (
            <div className="px-2 pb-4">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authState.user.avatar_url} />
                  <AvatarFallback>
                    {getInitials(authState.user.name)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {authState.user.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {authState.user.email}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className={cn("w-full mt-2 justify-start", collapsed && "justify-center")}
                onClick={signOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {!collapsed && "Sair"}
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
