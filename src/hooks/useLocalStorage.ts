
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar valores em localStorage com suporte a tipos
 * @param key Chave para armazenamento no localStorage
 * @param initialValue Valor inicial caso não exista no localStorage
 * @returns [value, setValue] para ler e atualizar o valor
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Função para obter o valor armazenado ou inicializá-lo
  const getStoredValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Erro ao carregar item do localStorage (${key}):`, error);
      return initialValue;
    }
  }, [key, initialValue]);
  
  // Estado para armazenar o valor
  const [value, setValue] = useState<T>(getStoredValue);
  
  // Atualizar o localStorage quando o valor mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar item no localStorage (${key}):`, error);
    }
  }, [key, value]);
  
  return [value, setValue] as const;
}
