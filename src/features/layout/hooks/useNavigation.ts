
import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
import { 
  Home, 
  Users, 
  BarChart, 
  Settings, 
  MessageSquare, 
  Shield, 
  Leaf 
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

interface NavigationHookResult {
  navItems: NavItem[];
  filteredItems: NavItem[];
  isActive: (href: string) => boolean;
}

/**
 * Hook para gerenciar itens de navegação e seu estado ativo
 * Filtra itens com base no papel do usuário
 */
export function useNavigation(userRole: Role | null): NavigationHookResult {
  const location = useLocation();

  // Definição de todos os itens de navegação com controle de acesso baseado em papel
  const navItems: NavItem[] = useMemo(() => [
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
  ], []);

  // Filtrar itens com base no papel do usuário
  const filteredItems = useMemo(() => 
    navItems.filter(item => userRole && item.roles.includes(userRole)), 
    [navItems, userRole]
  );

  // Verificar se um item está ativo com base na URL atual
  const isActive = useCallback(
    (href: string) => location.pathname === href,
    [location.pathname]
  );

  return {
    navItems,
    filteredItems,
    isActive
  };
}
