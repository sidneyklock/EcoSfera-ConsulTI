
import { User } from '@/types';
import React from 'react';

/**
 * Tipos de eventos customizados que a aplicação pode disparar
 */
export enum AppEventTypes {
  // Eventos de carregamento de página
  PAGE_LOAD_START = 'page_load_start',
  PAGE_LOAD_COMPLETE = 'page_load_complete',
  
  // Eventos de ações do usuário
  USER_ACTION_SUBMIT = 'user_action_submit',
  USER_ACTION_ERROR = 'user_action_error',
  
  // Eventos do Supabase
  SUPABASE_QUERY_ERROR = 'supabase_query_error',
  
  // Outros eventos do sistema
  AUTH_STATE_CHANGE = 'auth_state_change',
  NAVIGATION_CHANGE = 'navigation_change'
}

/**
 * Interface base para payload de eventos
 */
interface BaseEventPayload {
  timestamp: number;
  userId?: string;
}

/**
 * Interface para eventos de carregamento de página
 */
export interface PageEventPayload extends BaseEventPayload {
  path: string;
  component: string;
  duration?: number; // usado para page_load_complete
  referrer?: string;
}

/**
 * Interface para eventos de ação do usuário
 */
export interface UserActionEventPayload extends BaseEventPayload {
  action: string;
  component: string;
  data?: any;
  result?: 'success' | 'error';
  errorMessage?: string;
}

/**
 * Interface para eventos do Supabase
 */
export interface SupabaseEventPayload extends BaseEventPayload {
  operation: string;
  table?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: any;
}

/**
 * Tipo de união para todos os payloads de eventos
 */
export type AppEventPayload = PageEventPayload | UserActionEventPayload | SupabaseEventPayload;

/**
 * Função auxiliar para disparar eventos do aplicativo com payload tipado
 */
export function dispatchAppEvent<T extends AppEventPayload>(
  eventType: AppEventTypes, 
  payload: Omit<T, 'timestamp'>,
  user?: User | null
): void {
  // Adicionar timestamp e userId se aplicável
  const eventPayload = {
    ...payload,
    timestamp: Date.now(),
    userId: user?.id
  };
  
  // Disparar o evento customizado
  window.dispatchEvent(new CustomEvent(eventType, { 
    detail: eventPayload,
    bubbles: true,
    cancelable: true
  }));

  // Log no console em desenvolvimento para depuração
  if (import.meta.env.DEV) {
    console.log(`%c[APP EVENT] ${eventType}`, 'color: purple; font-weight: bold', eventPayload);
  }
}

/**
 * Funções simplificadas para disparar eventos específicos
 */

// Eventos de página
export function dispatchPageLoadStart(
  component: string,
  path: string = window.location.pathname,
  user?: User | null
): void {
  dispatchAppEvent<PageEventPayload>(AppEventTypes.PAGE_LOAD_START, {
    component,
    path,
    referrer: document.referrer
  }, user);
}

export function dispatchPageLoadComplete(
  component: string,
  loadTimeMs: number,
  path: string = window.location.pathname,
  user?: User | null
): void {
  dispatchAppEvent<PageEventPayload>(AppEventTypes.PAGE_LOAD_COMPLETE, {
    component,
    path,
    duration: loadTimeMs
  }, user);
}

// Eventos de ação do usuário
export function dispatchUserActionSubmit(
  action: string,
  component: string,
  data?: any,
  user?: User | null
): void {
  dispatchAppEvent<UserActionEventPayload>(AppEventTypes.USER_ACTION_SUBMIT, {
    action,
    component,
    data
  }, user);
}

export function dispatchUserActionError(
  action: string,
  component: string,
  errorMessage: string,
  data?: any,
  user?: User | null
): void {
  dispatchAppEvent<UserActionEventPayload>(AppEventTypes.USER_ACTION_ERROR, {
    action,
    component,
    errorMessage,
    data,
    result: 'error'
  }, user);
}

// Eventos do Supabase
export function dispatchSupabaseQueryError(
  operation: string,
  errorMessage: string,
  table?: string,
  errorCode?: string,
  metadata?: any,
  user?: User | null
): void {
  dispatchAppEvent<SupabaseEventPayload>(AppEventTypes.SUPABASE_QUERY_ERROR, {
    operation,
    errorMessage,
    table,
    errorCode,
    metadata
  }, user);
}

/**
 * Hook para adicionar listener para eventos customizados
 */
export function useAppEventListener<T extends AppEventPayload>(
  eventType: AppEventTypes,
  callback: (payload: T) => void
): void {
  React.useEffect(() => {
    const handler = (event: CustomEvent<T>) => {
      callback(event.detail);
    };
    
    window.addEventListener(eventType, handler as EventListener);
    
    return () => {
      window.removeEventListener(eventType, handler as EventListener);
    };
  }, [eventType, callback]);
}
