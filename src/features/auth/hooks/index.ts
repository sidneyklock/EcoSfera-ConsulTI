
export { useUserContext } from './useUserContext';
export { useAuthService } from './useAuthService'; // Mantido para compatibilidade
export { useAuth } from './useAuth'; // Novo hook principal
export { useAuthActions } from './useAuthActions';
export { useAuthContext } from './useAuthContext';
export { useAuthSession } from './useAuthSession';

// Aliases para manter compatibilidade com código existente
export { useAuth as useAuthentication } from './useAuth';
