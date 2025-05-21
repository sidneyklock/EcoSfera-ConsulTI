
import { useCallback } from "react";
import { useUserContext } from "@/features/auth/hooks";
import { dispatchUserActionSubmit, dispatchUserActionError } from "@/utils";

/**
 * Hook para enviar eventos de ações do usuário
 * 
 * @param componentName Nome do componente onde as ações ocorrem
 * @returns Objeto com funções para disparar eventos de ações do usuário
 */
export function useUserActionEvents(componentName: string) {
  const { data } = useUserContext();
  const user = data?.user;

  /**
   * Dispara um evento de submissão de ação do usuário
   */
  const submitAction = useCallback((
    actionName: string, 
    data?: any
  ) => {
    dispatchUserActionSubmit(actionName, componentName, data, user);
  }, [componentName, user]);

  /**
   * Dispara um evento de erro em uma ação do usuário
   */
  const errorAction = useCallback((
    actionName: string, 
    errorMessage: string, 
    data?: any
  ) => {
    dispatchUserActionError(actionName, componentName, errorMessage, data, user);
  }, [componentName, user]);

  /**
   * Wrapper para funções assíncronas com disparo de eventos
   */
  const withActionEvents = useCallback(async <T,>(
    actionName: string,
    actionFn: () => Promise<T>,
    data?: any
  ): Promise<T> => {
    try {
      submitAction(actionName, data);
      const result = await actionFn();
      return result;
    } catch (error) {
      errorAction(
        actionName, 
        error instanceof Error ? error.message : 'Erro desconhecido',
        data
      );
      throw error;
    }
  }, [submitAction, errorAction]);

  return {
    submitAction,
    errorAction,
    withActionEvents
  };
}

export default useUserActionEvents;
