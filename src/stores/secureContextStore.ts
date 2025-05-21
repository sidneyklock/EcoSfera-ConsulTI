
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Role, User } from '@/types';
import { SecureContextState } from './types/secureContext.types';
import { createUserRecord, assignUserRole as assignRole } from './operations/userOperations';
import { fetchUserContext as fetchContext } from './operations/contextOperations';

export const useSecureContextStore = create<SecureContextState>((set, get) => ({
  user: null,
  solutionId: null,
  role: null,
  loading: true,
  error: null,

  createUserRecord: async (authUser) => {
    try {
      await createUserRecord(authUser);
    } catch (error: any) {
      set({ error: `Error creating user record: ${error.message}` });
      throw error;
    }
  },

  fetchUserContext: async () => {
    await fetchContext(
      get().solutionId,
      (loading) => set({ loading }),
      (error) => set({ error }),
      (user, role, solutionId) => set({ user, role, solutionId }),
      get().createUserRecord
    );
  },
  
  setSolutionId: (solutionId) => {
    set({ solutionId });
  },

  assignUserRole: async (userEmail, roleName, solutionId) => {
    set({ loading: true, error: null });
    
    try {
      await assignRole(userEmail, roleName, solutionId);
      
      // Recarregar o contexto do usuário se for o usuário atual
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === userEmail) {
        await get().fetchUserContext();
      }
      
    } catch (error: any) {
      console.error('Erro ao atribuir papel ao usuário:', error);
      set({ 
        error: `Falha ao atribuir papel ao usuário: ${error.message || 'Erro desconhecido'}`, 
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  }
}));
