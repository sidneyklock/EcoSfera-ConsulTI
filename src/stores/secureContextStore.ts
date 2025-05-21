
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
  createUserRecord: (authUser: any) => Promise<void>;
  setSolutionId: (solutionId: string) => void;
  assignUserRole: (userEmail: string, roleName: Role, solutionId: string) => Promise<void>;
}

export const useSecureContextStore = create<SecureContextState>((set, get) => ({
  user: null,
  solutionId: null,
  role: null,
  loading: true,
  error: null,

  createUserRecord: async (authUser) => {
    try {
      console.log("createUserRecord: Creating/updating user record for", authUser.email);
      
      // Inserir o usuário na tabela public.users se não existir
      const { error: insertError } = await supabase
        .from('users')
        .upsert([
          { 
            id: authUser.id, 
            email: authUser.email,
            full_name: authUser.user_metadata?.name || authUser.email.split('@')[0]
          }
        ], { onConflict: 'id' });

      if (insertError) {
        console.error('Erro ao criar registro de usuário:', insertError);
        throw insertError;
      }
      
      console.log("createUserRecord: User record created/updated successfully");

    } catch (error: any) {
      console.error('Erro ao criar registro de usuário:', error);
      throw error;
    }
  },

  fetchUserContext: async () => {
    set({ loading: true, error: null });
    
    try {
      console.log("fetchUserContext: Fetching user context");
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("fetchUserContext: No active session found");
        set({ 
          user: null,
          solutionId: null,
          role: null,
          loading: false
        });
        return;
      }
      
      console.log("fetchUserContext: Session found, user is authenticated");
      
      // Automaticamente criar um registro de usuário se não existir
      const authUser = session.user;
      
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
        .maybeSingle();
      
      if (userError) {
        console.error("fetchUserContext: Error fetching user data", userError);
        set({ error: `Erro ao carregar dados do usuário: ${userError.message}`, loading: false });
        return;
      }
      
      if (!userData) {
        console.log("fetchUserContext: No user record found, creating one");
        // Criar o usuário se não existir
        await get().createUserRecord(authUser);
        
        // Define um papel padrão para o usuário
        set({ 
          user: {
            id: authUser.id,
            email: authUser.email,
            role: 'user',
            name: authUser.user_metadata?.name || authUser.email.split('@')[0] || ''
          },
          role: 'user',
          solutionId: null,
          loading: false
        });
        return;
      }
      
      console.log("fetchUserContext: User record found", userData);
      
      // Extrair o papel (role) do usuário e ID da solução (se existirem)
      const userRoles = userData.user_roles as any[] || [];
      const firstUserRole = userRoles[0];
      
      // Verificar se o usuário tem um papel e uma solução associada
      if (!firstUserRole) {
        console.log("fetchUserContext: No user role found, setting default role");
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
      
      console.log("fetchUserContext: User role found", firstUserRole);
      
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
        .maybeSingle();
        
      if (roleError) {
        console.error("fetchUserContext: Error fetching role data", roleError);
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
      
      console.log('SecureContext loaded:', { user, role: userRole, solutionId });
      
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
  },

  assignUserRole: async (userEmail, roleName, solutionId) => {
    set({ loading: true, error: null });
    
    try {
      console.log(`assignUserRole: Assigning role ${roleName} to user ${userEmail} for solution ${solutionId}`);
      
      // Utilizar a função assign_user_role do PostgreSQL via supabase.rpc
      const { error } = await supabase.rpc('assign_user_role', {
        in_user_email: userEmail,
        in_role_name: roleName,
        in_solution_id: solutionId
      });
      
      if (error) {
        throw error;
      }
      
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
