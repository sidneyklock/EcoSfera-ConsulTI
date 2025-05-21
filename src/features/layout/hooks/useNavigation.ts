
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, Settings, Shield, Activity, Leaf } from 'lucide-react';
import type { NavItem } from '@/types/navigation';
import type { Role } from '@/types/auth';

/**
 * Hook para gerenciar a navegação da aplicação
 * Filtra itens baseado no papel do usuário e identifica a rota ativa
 */
export function useNavigation(userRole: Role | null) {
  const location = useLocation();
  
  // Lista completa de itens de navegação
  const navItems: NavItem[] = useMemo(() => [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'user'],
    },
    {
      title: 'Administração',
      href: '/admin',
      icon: Shield,
      roles: ['admin'],
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: Activity,
      roles: ['admin'],
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: Users,
      roles: ['admin', 'user'],
    },
    {
      title: 'Chat IA',
      href: '/chat',
      icon: MessageSquare,
      roles: ['admin', 'user'],
      badge: {
        text: 'Novo',
        variant: 'default'
      }
    },
    {
      title: 'Sustentabilidade',
      href: '/sustainability',
      icon: Leaf,
      roles: ['admin', 'user'],
    },
    {
      title: 'Configurações',
      href: '/settings',
      icon: Settings,
      roles: ['admin', 'user'],
    },
  ], []);

  // Filtrar itens baseado no papel do usuário
  const filteredItems = useMemo(() => {
    if (!userRole) return [];
    return navItems.filter(item => item.roles.includes(userRole));
  }, [navItems, userRole]);

  // Verificar se uma rota está ativa
  const isActive = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/') {
      return true; // Considera dashboard ativo na raiz
    }
    
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    
    return location.pathname.startsWith(href);
  };

  return { filteredItems, isActive };
}
