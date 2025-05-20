
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { 
  iconClasses, 
  sidebarItemClasses, 
  sidebarItemActiveClasses, 
  sidebarItemInactiveClasses 
} from "@/lib/tailwind-utils";

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
                  sidebarItemClasses,
                  isActive(item.href)
                    ? sidebarItemActiveClasses
                    : sidebarItemInactiveClasses
                )}
              >
                <item.icon className={iconClasses} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
};
