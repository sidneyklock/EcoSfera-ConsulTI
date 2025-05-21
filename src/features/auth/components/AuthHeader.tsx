
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  title: string;
  description: string;
}

/**
 * Componente para cabeçalho de formulários de autenticação
 */
export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
