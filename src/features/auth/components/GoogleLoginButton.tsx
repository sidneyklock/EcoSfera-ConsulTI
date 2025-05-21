
import React from "react";
import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ["aria-label"]?: string;
  className?: string;
}

export function GoogleLoginButton({ onClick, disabled, className, ...props }: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full flex items-center justify-center ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <svg
        className="mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.212 1.387-1.375 3.2-2.163Q10.05 1.85 12 1.85q1.95 0 3.738.775 1.787.775 3.162 2.137 1.375 1.363 2.2 3.188.825 1.825.825 3.9 0 1.5-.387 2.9-.388 1.4-1.113 2.613l3.45 3.45-1.4 1.4-3.45-3.45q-1.225.725-2.6 1.112Q15.05 20.25 13.45 20.25q-3.425 0-5.837-2.4Q5.2 15.45 5.2 12q0-3.45 2.413-5.85Q10.025 3.75 13.45 3.75q1.4 0 2.725.475 1.325.475 2.45 1.35-.65-1.05-1.687-1.738Q15.9 3.15 14.45 3.15q-3.425 0-5.838 2.4Q6.2 7.95 6.2 11.4q0 3.45 2.412 5.85 2.413 2.4 5.838 2.4 3.45 0 5.837-2.4 2.388-2.4 2.388-5.85 0-.75-.15-1.5h-8.1V7.95h11.4q.15.8.225 1.625.075.825.075 1.575 0 2.05-.788 3.887-.787 1.838-2.15 3.2-1.362 1.363-3.187 2.15Q14.05 22 12 22Z"
        />
      </svg>
      <span>Entrar com Google</span>
    </Button>
  );
}
