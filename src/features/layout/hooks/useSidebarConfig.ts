
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarConfig {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
}

/**
 * Hook para gerenciar a configuração da barra lateral
 * Suporta armazenamento local para persistência e adaptação para dispositivos móveis
 */
export function useSidebarConfig(): SidebarConfig {
  const [storedCollapsed, setStoredCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [collapsed, setCollapsed] = useState(storedCollapsed);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Colapsar automaticamente em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  // Atualizar o armazenamento local quando o estado mudar
  useEffect(() => {
    setStoredCollapsed(collapsed);
  }, [collapsed, setStoredCollapsed]);
  
  // Alternar o estado de colapso
  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);
  
  return {
    collapsed,
    setCollapsed,
    toggleCollapsed
  };
}
