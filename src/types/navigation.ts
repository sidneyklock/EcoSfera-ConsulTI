
import { LucideIcon } from "lucide-react";
import { Role } from "./auth";

/**
 * Representa um item de navegação na barra lateral
 */
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export type MenuSection = {
  title?: string;
  items: NavItem[];
};
