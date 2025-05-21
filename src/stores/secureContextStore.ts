
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Buscar dados do usuário e informações relacionadas com JOIN
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id, email, full_name,
          user_roles (
            role_id,
            solutions (
              id, name
            )
          )
        `)
        .eq('id', session.user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle() to handle case where user might not be found
      
      if (userError) {
        set({ error: `Erro ao carregar dados do usuário: ${userError.message}`, loading: false });
        return;
      }
      
      if (!userData) {
        set({ error: 'Usuário não encontrado no banco de dados', loading: false });
        return;
      }
      
      // Extrair o papel (role) do usuário e ID da solução (se existirem)
      const userRoles = userData.user_roles as any[] || [];
      const firstUserRole = userRoles[0];
      
      // Verificar se o usuário tem um papel e uma solução associada
      if (!firstUserRole) {
        set({ 
          user: {
            id: userData.id,
            email: userData.email,
            role: 'user', // Papel padrão se não houver definido
            name: userData.full_name || userData.email.split('@')[0]
          },
          role: 'user',
          solutionId: null,
          loading: false
        });
        return;
      }
      
      // Extrair o ID da solução do primeiro papel do usuário (considerar preferência do usuário)
      const currentSolutionId = get().solutionId;
      let solutionId = currentSolutionId;
      
      if (!currentSolutionId && firstUserRole?.solutions?.id) {
        solutionId = firstUserRole.solutions.id;
      }
      
      // Buscar o papel específico do usuário
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('name')
        .eq('id', firstUserRole.role_id)
        .maybeSingle(); // Changed from .single() to .maybeSingle() to handle case where role might not be found
        
      if (roleError) {
        set({ error: `Erro ao carregar papel do usuário: ${roleError.message}`, loading: false });
        return;
      }
      
      // Montar o objeto do usuário com os dados obtidos
      const userRole = (roleData?.name || 'user') as Role;
      
      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userRole,
        name: userData.full_name || userData.email.split('@')[0]
      };
      
      set({
        user,
        solutionId,
        role: userRole,
        loading: false
      });
    } catch (error: any) {
      console.error('Erro ao buscar contexto do usuário:', error);
      set({ 
        error: `Falha ao carregar dados do usuário: ${error.message || 'Erro desconhecido'}`, 
        loading: false 
      });
    }
  },
  
  setSolutionId: (solutionId) => {
    set({ solutionId });
  }
}));
