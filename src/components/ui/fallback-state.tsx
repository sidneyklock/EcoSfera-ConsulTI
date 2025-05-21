
import React from 'react';
import { Loader, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FallbackStateProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  className?: string;
}

export const FallbackState = ({ 
  type, 
  title, 
  message, 
  className 
}: FallbackStateProps) => {
  // Default messages based on type
  const defaults = {
    loading: {
      title: 'Carregando dados',
      message: 'Por favor, aguarde enquanto carregamos os dados para você.',
      icon: <Loader className="h-10 w-10 animate-spin" />,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-500 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    error: {
      title: 'Ocorreu um erro',
      message: 'Não foi possível carregar os dados. Por favor, tente novamente mais tarde.',
      icon: <AlertTriangle className="h-10 w-10" />,
      bgColor: 'bg-red-50 dark:bg-red-950',
      iconColor: 'text-red-500 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    empty: {
      title: 'Nenhum dado encontrado',
      message: 'Não encontramos nenhum resultado para exibir.',
      icon: <Info className="h-10 w-10" />,
      bgColor: 'bg-gray-50 dark:bg-gray-900',
      iconColor: 'text-gray-500 dark:text-gray-400',
      borderColor: 'border-gray-200 dark:border-gray-800'
    }
  };

  const currentState = defaults[type];
  const displayTitle = title || currentState.title;
  const displayMessage = message || currentState.message;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border",
      "min-h-[200px] w-full",
      currentState.bgColor,
      currentState.borderColor,
      className
    )}>
      <div className={cn("mb-4", currentState.iconColor)} aria-hidden="true">
        {currentState.icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{displayMessage}</p>
    </div>
  );
};

export default FallbackState;
