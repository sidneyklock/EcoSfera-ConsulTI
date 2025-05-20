
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  BarChart,
  Settings,
  MessageSquare,
  Menu,
  X,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarFooter as SidebarFooterWrapper,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar-wrapper";
import { Role } from "@/types";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation, NavItem } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

export const AppSidebar = () => {
  const { authState, signOut } = useAuth();
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebarCollapse(false);

  // Itens de navegação com controle de acesso por role
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["user", "admin"],
    },
    {
      title: "Admin",
      href: "/admin",
      icon: Shield,
      roles: ["admin"],
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
        <SidebarHeaderWrapper className="py-4 px-4">
          <SidebarHeader collapsed={collapsed} />
        </SidebarHeaderWrapper>
        
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarNavigation 
              navItems={filteredItems} 
              isActive={isActive} 
              collapsed={collapsed} 
            />
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooterWrapper className="mt-auto">
          <SidebarFooter 
            user={authState.user} 
            collapsed={collapsed} 
            onSignOut={signOut}
          />
        </SidebarFooterWrapper>
      </Sidebar>
    </>
  );
};
