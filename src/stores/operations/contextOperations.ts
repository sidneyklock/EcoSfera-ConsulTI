
import { supabase } from '@/integrations/supabase/client';
import { Role, User } from '@/types';
import { createUserRecord } from './userOperations';

/**
 * Fetches the current user context from Supabase
 */
export async function fetchUserContext(
  currentSolutionId: string | null,
  setLoadingState: (loading: boolean) => void,
  setErrorState: (error: string | null) => void,
  setUserState: (user: User | null, role: Role | null, solutionId: string | null) => void,
  createRecord: (authUser: any) => Promise<void>
): Promise<void> {
  setLoadingState(true);
  setErrorState(null);
  
  try {
    console.log("fetchUserContext: Fetching user context");
    
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("fetchUserContext: No active session found");
      setUserState(null, null, null);
      return;
    }
    
    console.log("fetchUserContext: Session found, user is authenticated", session.user.email);
    
    // Automaticamente criar um registro de usuário se não existir
    const authUser = session.user;
    
    try {
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
        setErrorState(`Erro ao carregar dados do usuário: ${userError.message}`);
        return;
      }
      
      if (!userData) {
        console.log("fetchUserContext: No user record found, creating one");
        // Criar o usuário se não existir
        try {
          await createRecord(authUser);
          
          // Define um papel padrão para o usuário
          const defaultUser = {
            id: authUser.id,
            email: authUser.email || '',
            role: 'user' as Role,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || ''
          };
          
          setUserState(defaultUser, 'user', null);
        } catch (err) {
          console.error("Error creating user record:", err);
          setErrorState(`Failed to create user record: ${err}`);
        }
        return;
      }
      
      console.log("fetchUserContext: User record found", userData);
      
      // Extrair o papel (role) do usuário e ID da solução (se existirem)
      const userRoles = userData.user_roles || [];
      const firstUserRole = userRoles[0];
      
      // Verificar se o usuário tem um papel e uma solução associada
      if (!firstUserRole) {
        console.log("fetchUserContext: No user role found, setting default role");
        const defaultUser = {
          id: userData.id,
          email: userData.email,
          role: 'user' as Role, // Papel padrão se não houver definido
          name: userData.full_name || userData.email.split('@')[0]
        };
        
        setUserState(defaultUser, 'user', null);
        return;
      }
      
      console.log("fetchUserContext: User role found", firstUserRole);
      
      // Extrair o ID da solução do primeiro papel do usuário (considerar preferência do usuário)
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
        setErrorState(`Erro ao carregar papel do usuário: ${roleError.message}`);
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
      
      setUserState(user, userRole, solutionId);
      
      console.log('SecureContext loaded:', { user, role: userRole, solutionId });
    
    } catch (fetchError: any) {
      console.error("Error in fetchUserContext data fetching:", fetchError);
      setErrorState(`Error fetching user data: ${fetchError.message}`);
    }
    
  } catch (error: any) {
    console.error('Erro ao buscar contexto do usuário:', error);
    setErrorState(`Falha ao carregar dados do usuário: ${error.message || 'Erro desconhecido'}`);
  } finally {
    setLoadingState(false);
  }
}
