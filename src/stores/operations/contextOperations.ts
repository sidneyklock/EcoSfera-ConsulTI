
import { supabase } from '@/integrations/supabase/client';
import { Role, User } from '@/types';
import { createUserRecord } from './userOperations';
import { logger } from '@/utils';
import fetchLogger from '@/utils/fetchLogger';
import { dispatchSupabaseQueryError, dispatchUserActionError, dispatchUserActionSubmit } from '@/utils/events';

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
    fetchLogger.start("fetch_user_context", "Buscando contexto do usuário");
    dispatchUserActionSubmit("fetch_user_context", "contextOperations", { currentSolutionId });
    
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      dispatchSupabaseQueryError(
        "auth.getSession",
        sessionError.message,
        "auth.session",
        sessionError.code
      );
      throw sessionError;
    }
    
    if (!session) {
      fetchLogger.success("fetch_user_context", "Nenhuma sessão ativa encontrada", { authStatus: false });
      setUserState(null, null, null);
      return;
    }
    
    fetchLogger.success("fetch_user_context", "Sessão encontrada, usuário autenticado", { 
      userEmail: session.user.email 
    });
    
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
        fetchLogger.error("fetch_user_context", "Erro ao buscar dados do usuário", userError, {
          userId: session.user.id
        });
        
        dispatchSupabaseQueryError(
          "users.select",
          userError.message,
          "users",
          userError.code,
          { userId: session.user.id }
        );
        
        setErrorState(`Erro ao carregar dados do usuário: ${userError.message}`);
        return;
      }
      
      if (!userData) {
        logger.info({
          userId: session.user.id,
          action: "fetch_user_context",
          message: "Nenhum registro de usuário encontrado, criando um",
          status: 'success'
        });
        
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
          
          fetchLogger.success("fetch_user_context", "Registro de usuário criado com sucesso", {
            userId: defaultUser.id,
            userEmail: defaultUser.email
          });
        } catch (err) {
          fetchLogger.error("fetch_user_context", "Erro ao criar registro de usuário", err, {
            userId: session.user.id
          });
          
          dispatchUserActionError(
            "create_user_record",
            "contextOperations",
            err instanceof Error ? err.message : "Erro desconhecido",
            { userId: session.user.id },
            { id: session.user.id } as User
          );
          
          setErrorState(`Failed to create user record: ${err}`);
        }
        return;
      }
      
      logger.info({
        userId: userData.id,
        action: "fetch_user_context",
        message: "Registro de usuário encontrado",
        data: userData,
        status: 'success'
      });
      
      // Extrair o papel (role) do usuário e ID da solução (se existirem)
      const userRoles = userData.user_roles || [];
      const firstUserRole = userRoles[0];
      
      // Verificar se o usuário tem um papel e uma solução associada
      if (!firstUserRole) {
        logger.info({
          userId: userData.id,
          action: "fetch_user_context",
          message: "Nenhum papel de usuário encontrado, definindo papel padrão",
          status: 'success'
        });
        
        const defaultUser = {
          id: userData.id,
          email: userData.email,
          role: 'user' as Role, // Papel padrão se não houver definido
          name: userData.full_name || userData.email.split('@')[0]
        };
        
        setUserState(defaultUser, 'user', null);
        return;
      }
      
      logger.info({
        userId: userData.id,
        action: "fetch_user_context",
        message: "Papel de usuário encontrado",
        data: firstUserRole,
        status: 'success'
      });
      
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
        fetchLogger.error("fetch_user_context", "Erro ao buscar dados do papel", roleError, {
          userId: userData.id,
          roleId: firstUserRole.role_id
        });
        
        dispatchSupabaseQueryError(
          "roles.select",
          roleError.message,
          "roles",
          roleError.code,
          { 
            userId: userData.id, 
            roleId: firstUserRole.role_id 
          },
          { id: userData.id } as User
        );
        
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
      
      fetchLogger.success("fetch_user_context", "Contexto de segurança carregado", {
        userId: user.id,
        userEmail: user.email,
        userRole: userRole,
        solutionId
      });
    
    } catch (fetchError: any) {
      fetchLogger.error("fetch_user_context", "Erro na busca de dados de contexto do usuário", fetchError);
      
      dispatchUserActionError(
        "fetch_user_context",
        "contextOperations",
        fetchError.message || "Erro desconhecido",
        { userId: session?.user?.id }
      );
      
      setErrorState(`Error fetching user data: ${fetchError.message}`);
    }
    
  } catch (error: any) {
    fetchLogger.error("fetch_user_context", "Erro ao buscar contexto do usuário", error);
    
    dispatchUserActionError(
      "fetch_user_context",
      "contextOperations",
      error.message || "Erro desconhecido",
      {}
    );
    
    setErrorState(`Falha ao carregar dados do usuário: ${error.message || 'Erro desconhecido'}`);
  } finally {
    setLoadingState(false);
  }
}
