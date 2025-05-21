
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const TestEdgeFunction = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testFunction = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch(
        "https://dlequbzzlavikbxgzlkc.functions.supabase.co/chat-completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Qual é a capital da França?",
            userId: "test-user-id", // Fornecemos um userId fictício para teste
            solutionId: null
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao comunicar com a função Edge");
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Erro no teste da função Edge:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Teste da Função Edge chat-completions</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes do Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Método:</strong> POST</p>
            <p><strong>URL:</strong> https://dlequbzzlavikbxgzlkc.functions.supabase.co/chat-completions</p>
            <p><strong>Payload:</strong></p>
            <pre className="bg-muted p-3 rounded text-sm overflow-auto">
              {JSON.stringify({
                message: "Qual é a capital da França?",
                userId: "test-user-id",
                solutionId: null
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={testFunction} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              "Executar Teste"
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription className="font-mono text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
              {response}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestEdgeFunction;
