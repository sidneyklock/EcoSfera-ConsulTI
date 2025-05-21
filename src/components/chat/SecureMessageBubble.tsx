
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface SecureMessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

/**
 * Parses simple markdown to safe HTML
 * Supports: **bold**, *italic*, # heading, - list items
 */
const parseMarkdown = (text: string): string => {
  // Escape HTML to prevent XSS
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  
  // Parse basic markdown
  return escaped
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Headings: # Heading
    .replace(/^# (.*$)/gm, '<h3 class="text-lg font-bold mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h4 class="text-md font-semibold mb-1">$1</h4>')
    // Lists: - Item
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    // Convert line breaks
    .replace(/\n/g, '<br />');
};

const SecureMessageBubble = ({ role, content, timestamp }: SecureMessageBubbleProps) => {
  const isUser = role === "user";
  
  // Convert markdown to safe HTML
  const parsedContent = parseMarkdown(content);
  
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%] mb-4",
        isUser ? "ml-auto" : ""
      )}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-lg p-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div 
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
          aria-label={`Mensagem de ${isUser ? 'usuário' : 'assistente'}`}
        />
        {timestamp && (
          <p className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default SecureMessageBubble;
