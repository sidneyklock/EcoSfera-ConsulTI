
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Role } from '@/types';

interface UserSolution {
  solution_id: string;
  role: Role;
}

interface SecureContextState {
  user: User | null;
  solutionId: string | null;
  role: Role | null;
  loading: boolean;
  error: Error | null;
  fetchUserContext: () => Promise<void>;
}

export const useSecureContextStore = create<SecureContextState>((set) => ({
  user: null,
  solutionId: null,
  role: null,
  loading: true,
  error: null,
  fetchUserContext: async () => {
    set({ loading: true, error: null });
    
    try {
      // Obter o usuário atual do Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        set({ 
          user: null, 
          solutionId: null, 
          role: null, 
          loading: false 
        });
        return;
      }
      
      // Buscar dados do usuário na tabela user_solutions
      const { data: userSolution, error: solutionError } = await supabase
        .from('user_solutions')
        .select('solution_id, role')
        .eq('user_id', user.id)
        .single();
      
      if (solutionError && solutionError.code !== 'PGRST116') { // Não é um erro "not found"
        throw solutionError;
      }
      
      set({
        user,
        solutionId: userSolution?.solution_id || null,
        role: userSolution?.role || null,
        loading: false,
      });
      
    } catch (error) {
      console.error('Error fetching secure context:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Erro desconhecido ao carregar contexto'), 
        loading: false 
      });
    }
  }
}));
