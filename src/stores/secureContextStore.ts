
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Role, User } from '@/types';

interface SecureContextState {
  user: User | null;
  solutionId: string | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  fetchUserContext: () => Promise<void>;
  setSolutionId: (solutionId: string) => void;
}

export const useSecureContextStore = create<SecureContextState>((set, get) => ({
  user: null,
  solutionId: null,
  role: null,
  loading: true,
  error: null,

  fetchUserContext: async () => {
    set({ loading: true, error: null });
    
    // Se o Supabase não estiver configurado, definimos um estado padrão
    if (!isSupabaseConfigured()) {
      set({ 
        user: null, 
        solutionId: null, 
        role: null, 
        loading: false,
        error: "Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
      });
      return;
    }
    
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ 
          user: null,
          solutionId: null,
          role: null,
          loading: false
        });
        return;
      }
      
      // Buscar dados do usuário e sua role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, name, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        set({ error: userError.message, loading: false });
        return;
      }
      
      // Buscar a primeira solução disponível para o usuário (se ainda não tiver uma selecionada)
      const currentSolutionId = get().solutionId;
      let solutionId = currentSolutionId;
      
      if (!currentSolutionId) {
        const { data: solutionData } = await supabase
          .from('user_solutions')
          .select('solution_id')
          .eq('user_id', userData.id)
          .limit(1)
          .single();
        
        solutionId = solutionData?.solution_id || null;
      }
      
      // Montar o objeto do usuário
      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        avatar_url: userData.avatar_url
      };
      
      set({
        user,
        solutionId,
        role: userData.role,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar contexto do usuário:', error);
      set({ 
        error: 'Falha ao carregar dados do usuário', 
        loading: false 
      });
    }
  },
  
  setSolutionId: (solutionId) => {
    set({ solutionId });
  }
}));
