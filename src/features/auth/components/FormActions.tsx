
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  submitLabel: string;
  devLoginEnabled?: boolean;
  onDevLogin?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FormActions({ 
  isLoading, 
  submitLabel, 
  devLoginEnabled = false,
  onDevLogin,
  className = "space-y-4",
  disabled = false
}: FormActionsProps) {
  return (
    <div className={className}>
      {/* Botão de login/registro principal */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || disabled}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Aguarde</span>
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </Button>
      
      {/* Botão de login para desenvolvimento (opcional) */}
      {devLoginEnabled && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-muted-foreground/50"
          onClick={onDevLogin}
          disabled={isLoading}
        >
          Login Rápido (Desenvolvimento)
        </Button>
      )}
    </div>
  );
}
