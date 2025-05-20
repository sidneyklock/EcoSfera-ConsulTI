
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
};

interface SidebarNavigationProps {
  navItems: NavItem[];
  isActive: (href: string) => boolean;
  collapsed: boolean;
}

export const SidebarNavigation = ({ navItems, isActive, collapsed }: SidebarNavigationProps) => {
  return (
    <>
      {!collapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
      <SidebarMenu>
        {navItems.map((item) => (
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
    </>
  );
};
