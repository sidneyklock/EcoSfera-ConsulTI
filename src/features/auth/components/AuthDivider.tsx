
import React from "react";

export function AuthDivider() {
  return (
    <div className="relative my-4" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">
          Ou continue com
        </span>
      </div>
    </div>
  );
}
