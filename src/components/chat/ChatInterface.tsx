
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";
import { SendHorizonal, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecureContext } from "@/hooks/useSecureContext";
import SecureMessageBubble from "./SecureMessageBubble";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, solutionId } = useSecureContext();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation history from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        setIsInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          setError("Não foi possível carregar o histórico de mensagens.");
        } else {
          const formattedMessages = data.map(
            (msg): ChatMessage => ({
              id: msg.id,
              role: msg.role as "user" | "assistant" | "system",
              content: msg.message,
              timestamp: new Date(msg.created_at || new Date()),
              sender: msg.role === "user" ? user.name || user.email : "Assistant"
            })
          );
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
        setError("Ocorreu um erro ao carregar as mensagens.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    const message = inputValue.trim();
    setInputValue("");
    
    // Optimistically add user message to UI
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
      sender: user.name || user.email
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call Edge Function for GPT-4o response
      const response = await fetch(
        "https://dlequbzzlavikbxgzlkc.functions.supabase.co/chat-completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            userId: user.id,
            solutionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao obter resposta do assistente.");
      }

      // Fetch the updated messages after the edge function has saved them
      const { data: updatedData, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw new Error("Não foi possível atualizar as mensagens.");
      }

      // Update messages with the freshly fetched data
      const formattedMessages = updatedData.map(
        (msg): ChatMessage => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.message,
          timestamp: new Date(msg.created_at || new Date()),
          sender: msg.role === "user" ? user.name || user.email : "Assistant"
        })
      );
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao processar sua mensagem."
      );
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
        {isInitialLoading ? (
          <>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="h-4 w-4 text-primary" aria-hidden="true">🤖</span>
              </div>
              <div className="rounded-md p-3 bg-muted max-w-[80%]">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="flex gap-3 ml-auto">
              <div className="rounded-md p-3 bg-primary max-w-[80%]">
                <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
              </div>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </>
        ) : messages.length === 0 && !error ? (
          <div className="flex items-center justify-center h-full flex-col gap-4 text-center p-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-4xl" aria-hidden="true">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Bem-vindo(a) ao Chat com IA</h3>
              <p className="text-muted-foreground">
                Envie uma mensagem para iniciar uma conversa com o assistente.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <SecureMessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))
        )}
        
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
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
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
            disabled={isLoading || !user}
            aria-label="Mensagem"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputValue.trim() || !user}
            aria-label="Enviar mensagem"
          >
            <SendHorizonal className={cn("h-5 w-5", isLoading && "animate-pulse")} />
          </Button>
        </div>
      </form>
    </div>
  );
};
