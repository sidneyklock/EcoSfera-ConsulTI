import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import SecureMessageBubble from "./SecureMessageBubble";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { authState } = useAuth();

  // Rola para o final das mensagens quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simula uma resposta do assistente (será substituído pela integração real com GPT-4o)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(inputValue),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Função para gerar respostas simuladas com base no input do usuário
  const getSimulatedResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("olá") || lowerInput.includes("oi") || lowerInput.includes("bom dia") || lowerInput.includes("boa tarde") || lowerInput.includes("boa noite")) {
      return `Olá ${authState.user?.name || ""}! Como posso ajudar você hoje?`;
    }
    
    if (lowerInput.includes("ajuda") || lowerInput.includes("help")) {
      return "Posso ajudar com informações sobre projetos, tarefas, e análises de dados. O que você gostaria de saber?";
    }
    
    if (lowerInput.includes("projeto") || lowerInput.includes("projetos")) {
      return "Você tem 3 projetos ativos no momento. Gostaria de ver mais detalhes sobre algum deles?";
    }
    
    if (lowerInput.includes("relatório") || lowerInput.includes("analise") || lowerInput.includes("análise")) {
      return "Posso gerar relatórios detalhados sobre seus projetos e atividades. Que tipo de informação você está procurando?";
    }
    
    if (lowerInput.includes("reunião") || lowerInput.includes("agenda")) {
      return "Sua próxima reunião está agendada para hoje às 15:00. Deseja que eu envie um lembrete?";
    }
    
    return "Entendi sua mensagem. Como posso te ajudar com isso? Para dar uma resposta mais precisa, eu precisaria estar conectado a uma API de IA como GPT-4o.";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] bg-card rounded-lg border shadow">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span aria-hidden="true" className="h-5 w-5 inline-flex items-center justify-center">🤖</span> 
          <span>Chat com IA</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Converse com nosso assistente inteligente
        </p>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <SecureMessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="h-4 w-4 text-primary" aria-hidden="true">🤖</span>
            </div>
            <div className="rounded-md p-3 bg-muted w-16">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled={isLoading}
            aria-label="Mensagem"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputValue.trim()}
            aria-label="Enviar mensagem"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
