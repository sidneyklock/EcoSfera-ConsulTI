
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
  Shield
} from "lucide-react";
import { Role } from "@/types";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation, NavItem } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { iconClasses, sidebarElementClasses } from "@/lib/tailwind-utils";

export const AppSidebar = () => {
  const { authState, signOut } = useAuth();
  const location = useLocation();
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarCollapse(false);

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

  // Filter items based on the current user's role
  const filteredItems = navItems.filter(
    (item) => authState.user && item.roles.includes(authState.user.role)
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
          className={sidebarElementClasses.container}
        >
          <SidebarHeaderWrapper className={sidebarElementClasses.header}>
            <SidebarHeader collapsed={collapsed} />
          </SidebarHeaderWrapper>
          
          <SidebarContent className={sidebarElementClasses.content}>
            <SidebarGroup>
              <SidebarNavigation 
                navItems={filteredItems} 
                isActive={isActive} 
                collapsed={collapsed} 
              />
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooterWrapper className={sidebarElementClasses.footer}>
            <SidebarFooter 
              user={authState.user} 
              collapsed={collapsed} 
              onSignOut={signOut}
            />
          </SidebarFooterWrapper>
        </Sidebar>
      </SidebarProvider>
    </>
  );
};
