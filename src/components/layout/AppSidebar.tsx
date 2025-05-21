
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter as SidebarFooterWrapper,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { useSidebarConfig } from "@/features/layout/hooks/useSidebarConfig";
import { useNavigation } from "@/features/layout/hooks/useNavigation";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { 
  iconClasses,
  sidebarElementClasses,
  buttonStateClasses,
  transitions,
  animations,
  a11yClasses
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface AppSidebarProps {
  solutionId: string | null;
  userRole: Role | null;
}

/**
 * Componente principal de navegação lateral da aplicação
 * Utiliza hooks especializados para gerenciar sua configuração
 */
export const AppSidebar = ({ solutionId, userRole }: AppSidebarProps) => {
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarConfig();
  const { filteredItems, isActive } = useNavigation(userRole);
  const { handleSignOut } = useAuthActions();

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
          a11yClasses.focusVisible,
          animations.fadeIn
        )}
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <Menu className={cn(iconClasses.base, transitions.transform)} />
        ) : (
          <X className={cn(iconClasses.base, transitions.transform)} />
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
            a11yClasses.focusVisible
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
