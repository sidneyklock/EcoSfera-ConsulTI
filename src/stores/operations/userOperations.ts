
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/types';

/**
 * Creates or updates a user record in the database
 */
export async function createUserRecord(authUser: any): Promise<void> {
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
}

/**
 * Assigns a role to a user for a specific solution
 */
export async function assignUserRole(
  userEmail: string, 
  roleName: Role, 
  solutionId: string
): Promise<void> {
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
    
  } catch (error: any) {
    console.error('Erro ao atribuir papel ao usuário:', error);
    throw error;
  }
}
