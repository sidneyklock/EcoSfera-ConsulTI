
import React from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TestEdgeFunction from '@/tests/testEdgeFunction';

const TestPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teste de Função Edge</h1>
        <p className="text-muted-foreground mt-2">
          Valide o funcionamento da função Edge chat-completions e sua integração com a API da OpenAI
        </p>
      </div>
      <TestEdgeFunction />
    </DashboardLayout>
  );
};

export default TestPage;
