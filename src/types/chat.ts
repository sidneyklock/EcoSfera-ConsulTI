
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead?: boolean;
  type?: 'text' | 'image' | 'file';
  attachment?: {
    url: string;
    name: string;
    type: string;
    size?: number;
  };
}
