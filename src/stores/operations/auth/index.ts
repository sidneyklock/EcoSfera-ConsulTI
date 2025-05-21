
import { signIn } from './authSignIn';
import { signUp } from './authSignUp';
import { signInWithGoogle } from './authGoogle';
import { signOut } from './authSignOut';
import { refreshContext } from './authContext';
import { clearError } from './authUtils';

/**
 * Operations relacionadas à autenticação
 */
export const authOperations = {
  clearError,
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
  refreshContext
};
