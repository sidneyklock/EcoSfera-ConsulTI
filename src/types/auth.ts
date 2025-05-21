
export type Role = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: Role;
  created_at?: string;
  last_sign_in_at?: string;
  metadata?: Record<string, any>;
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expires_at?: number;
}
