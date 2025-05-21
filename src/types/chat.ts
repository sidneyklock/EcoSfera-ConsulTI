
export interface ChatMessage {
  id: string;
  content: string;
  sender?: string; // Make sender optional since we're using role instead
  timestamp: Date;
  isRead?: boolean;
  type?: 'text' | 'image' | 'file';
  role: 'user' | 'system' | 'assistant'; // Make role required since we're using it instead of sender
  attachment?: {
    url: string;
    name: string;
    type: string;
    size?: number;
  };
}
