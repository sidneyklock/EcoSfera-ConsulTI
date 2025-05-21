
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppEventTypes, AppEventPayload } from "@/utils/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash } from "lucide-react";

/**
 * Componente para visualizar e depurar eventos customizados em tempo real
 */
export function EventsViewer() {
  const [events, setEvents] = useState<Array<{type: string, payload: any, timestamp: number}>>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    // Handler genérico para os eventos
    const handleEvent = (eventType: AppEventTypes) => (e: CustomEvent) => {
      setEvents(prev => [
        {
          type: eventType,
          payload: e.detail,
          timestamp: Date.now()
        }, 
        ...prev.slice(0, 99) // Manter apenas os últimos 100 eventos
      ]);
    };

    // Registrar ouvintes para todos os tipos de eventos
    const handlers = Object.values(AppEventTypes).map(eventType => {
      const handler = handleEvent(eventType);
      window.addEventListener(eventType, handler as EventListener);
      return { eventType, handler };
    });
    
    // Cleanup: remover os ouvintes ao desmontar o componente
    return () => {
      handlers.forEach(({ eventType, handler }) => {
        window.removeEventListener(eventType, handler as EventListener);
      });
    };
  }, []);

  // Filtrar eventos
  const filteredEvents = filter 
    ? events.filter(event => event.type === filter) 
    : events;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle>Visualizador de Eventos</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEvents([])}
          >
            <Trash className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
        <CardDescription>
          Monitora eventos personalizados em tempo real
        </CardDescription>
        
        {/* Filtro de eventos */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge 
            variant={filter === null ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter(null)}
          >
            Todos
          </Badge>
          
          {Object.values(AppEventTypes).map(eventType => (
            <Badge
              key={eventType}
              variant={filter === eventType ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(eventType)}
            >
              {eventType}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhum evento capturado
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event, index) => (
                <div 
                  key={`${event.type}-${index}-${event.timestamp}`} 
                  className="border rounded-md p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default EventsViewer;
