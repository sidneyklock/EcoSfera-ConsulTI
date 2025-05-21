
import { User } from '@/types';

/**
 * Mapeia dados do usuário do Auth para o modelo interno
 */
export const mapUserFromAuth = (authUser: any, userData?: any): User => {
  return {
    id: authUser.id,
    email: authUser.email,
    name: userData?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
    avatar_url: authUser.user_metadata?.avatar_url,
    role: userData?.role || 'user'
  };
};
