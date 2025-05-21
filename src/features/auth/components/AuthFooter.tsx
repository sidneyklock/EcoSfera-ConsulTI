
import React from "react";
import { Button } from "@/components/ui/button";

interface AuthFooterProps {
  questionText: string;
  actionText: string;
  onAction: () => void;
}

/**
 * Componente para rodapé de formulários de autenticação
 */
export function AuthFooter({ questionText, actionText, onAction }: AuthFooterProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center text-sm">
        {questionText}{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={onAction}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}
