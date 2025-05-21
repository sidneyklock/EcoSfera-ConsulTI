
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead?: boolean;
  type?: 'text' | 'image' | 'file';
  role?: 'user' | 'system' | 'assistant';
  attachment?: {
    url: string;
    name: string;
    type: string;
    size?: number;
  };
}
