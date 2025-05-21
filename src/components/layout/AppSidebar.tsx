
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter as SidebarFooterWrapper,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  BarChart,
  Settings,
  MessageSquare,
  Menu,
  X,
  Shield,
  Leaf
} from "lucide-react";
import { Role } from "@/types";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation, NavItem } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { 
  iconClasses,
  sidebarElementClasses,
  buttonStateClasses
} from "@/lib/tailwind-utils";
import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { animations, transitions } from "@/lib/utils";

interface AppSidebarProps {
  solutionId: string | null;
  userRole: Role | null;
}

export const AppSidebar = ({ solutionId, userRole }: AppSidebarProps) => {
  const location = useLocation();
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarCollapse(false);
  const { signOut } = useAuthStore();

  // Detectar tamanho da tela e ajustar sidebar para melhor experiência mobile
  const handleScreenResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    } else if (window.innerWidth >= 1280) {
      setCollapsed(false);
    }
  }, [setCollapsed]);

  useEffect(() => {
    // Configurar estado inicial baseado no tamanho da tela
    handleScreenResize();
    
    // Adicionar evento para detectar mudanças de tamanho de tela
    window.addEventListener('resize', handleScreenResize);
    
    // Fechar sidebar em dispositivos móveis quando a rota mudar
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }

    return () => {
      window.removeEventListener('resize', handleScreenResize);
    };
  }, [location.pathname, setCollapsed, handleScreenResize]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Navigation items with role-based access control
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
      title: "Consultoria",
      href: "/chat",
      icon: MessageSquare,
      roles: ["user", "admin"],
    },
    {
      title: "Sustentabilidade",
      href: "/sustainability",
      icon: Leaf,
      roles: ["user", "admin"],
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
      roles: ["user", "admin"],
    },
  ];

  // Filter items based on the current user's role
  const filteredItems = navItems.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  // Check if the current item is active
  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile toggle with improved accessibility and visual feedback */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 right-4 z-50 md:hidden shadow-sm",
          transitions.all,
          buttonStateClasses.active,
          buttonStateClasses.hover,
          animations.fadeIn
        )}
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <Menu className={cn(iconClasses, transitions.transform)} />
        ) : (
          <X className={cn(iconClasses, transitions.transform)} />
        )}
      </Button>

      <SidebarProvider
        defaultOpen={!collapsed}
        open={!collapsed}
        onOpenChange={(open) => setCollapsed(!open)}
      >
        <Sidebar
          collapsible="icon"
          className={cn(
            sidebarElementClasses.container, 
            "border-r border-border bg-background shadow-sm",
            transitions.all,
            "focus-visible:outline-none"
          )}
          aria-label="Navegação principal"
        >
          <SidebarHeaderWrapper className={cn(sidebarElementClasses.header, "px-4 py-4 border-b")}>
            <SidebarHeader 
              collapsed={collapsed} 
              solutionId={solutionId}
            />
          </SidebarHeaderWrapper>
          
          <SidebarContent className={cn(sidebarElementClasses.content, "py-4 px-2")}>
            <SidebarGroup>
              <SidebarNavigation 
                navItems={filteredItems} 
                isActive={isActive} 
                collapsed={collapsed} 
              />
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooterWrapper className={cn(sidebarElementClasses.footer, "mt-auto p-4 border-t")}>
            <SidebarFooter 
              user={userRole ? { name: '', email: '', id: '', role: userRole } : null} 
              collapsed={collapsed} 
              onSignOut={handleSignOut}
            />
          </SidebarFooterWrapper>
        </Sidebar>
      </SidebarProvider>
    </>
  );
};
