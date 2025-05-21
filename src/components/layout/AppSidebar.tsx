
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
import { iconClasses, sidebarElementClasses } from "@/lib/tailwind-utils";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";

interface AppSidebarProps {
  solutionId: string | null;
  userRole: Role | null;
}

export const AppSidebar = ({ solutionId, userRole }: AppSidebarProps) => {
  const location = useLocation();
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarCollapse(false);
  const { signOut } = useAuthStore();

  useEffect(() => {
    console.log("AppSidebar: Rendering with userRole:", userRole);
  }, [userRole]);

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
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
      >
        {collapsed ? (
          <Menu className={iconClasses} />
        ) : (
          <X className={iconClasses} />
        )}
      </Button>

      <SidebarProvider
        defaultOpen={!collapsed}
        open={!collapsed}
        onOpenChange={(open) => setCollapsed(!open)}
      >
        <Sidebar
          collapsible="icon"
          className={`${sidebarElementClasses.container} border-r border-border bg-background`}
          aria-label="Navegação principal"
        >
          <SidebarHeaderWrapper className={`${sidebarElementClasses.header} px-4 py-3`}>
            <SidebarHeader 
              collapsed={collapsed} 
              solutionId={solutionId}
            />
          </SidebarHeaderWrapper>
          
          <SidebarContent className={`${sidebarElementClasses.content} py-2 px-1`}>
            <SidebarGroup>
              <SidebarNavigation 
                navItems={filteredItems} 
                isActive={isActive} 
                collapsed={collapsed} 
              />
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooterWrapper className={`${sidebarElementClasses.footer} mt-auto p-4`}>
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
