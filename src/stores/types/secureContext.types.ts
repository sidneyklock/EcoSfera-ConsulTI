
import { Role, User } from '@/types';

export interface SecureContextState {
  user: User | null;
  solutionId: string | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  fetchUserContext: () => Promise<void>;
  createUserRecord: (authUser: any) => Promise<void>;
  setSolutionId: (solutionId: string) => void;
  assignUserRole: (userEmail: string, roleName: Role, solutionId: string) => Promise<void>;
}
