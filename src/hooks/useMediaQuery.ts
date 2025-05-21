
import { useEffect, useState } from 'react';

/**
 * Hook para monitorar media queries CSS
 * @param query A media query CSS a ser monitorada
 * @returns Booleano indicando se a media query corresponde
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Definir o valor inicial
    setMatches(mediaQuery.matches);
    
    // Criar uma função de callback que atualiza o estado
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Adicionar o listener e remover ao desmontar
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}
