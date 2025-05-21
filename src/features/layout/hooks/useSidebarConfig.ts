
import { useCallback, useEffect } from "react";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useLocation } from "react-router-dom";
import { logger } from "@/utils/logger";

interface SidebarConfig {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

/**
 * Hook para gerenciar a configuração e comportamento da sidebar
 * Controla estados de colapso e ajustes responsivos
 */
export function useSidebarConfig(): SidebarConfig {
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarCollapse(false);
  const location = useLocation();

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
    
    logger.debug({
      action: "sidebar_config",
      message: "Configurando sidebar responsiva",
      data: { initialCollapsed: collapsed }
    });
    
    // Fechar sidebar em dispositivos móveis quando a rota mudar
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }

    return () => {
      window.removeEventListener('resize', handleScreenResize);
    };
  }, [location.pathname, setCollapsed, handleScreenResize, collapsed]);

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed
  };
}
