
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Role } from '@/types';

/**
 * Create or update user record in the users table
 * @param authUser User object from Supabase auth
 * @returns Success status and any error
 */
export const createUserRecord = async (authUser: any) => {
  if (!authUser || !authUser.id) {
    return { success: false, error: 'Invalid user data' };
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .single();

    // If user doesn't exist, create a new record
    if (!existingUser) {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          },
        ]);

      if (error) {
        logger.error({
          userId: authUser.id,
          action: 'create_user_record_error',
          message: `Failed to create user record: ${error.message}`,
          data: { error },
        });
        return { success: false, error: error.message };
      }

      logger.info({
        userId: authUser.id,
        action: 'create_user_record_success',
        message: 'User record created successfully',
      });
    } else {
      // User exists - we could update here if needed
      logger.debug({
        userId: authUser.id,
        action: 'user_record_exists',
        message: 'User record already exists',
      });
    }

    return { success: true, error: null };
  } catch (error: any) {
    logger.error({
      userId: authUser.id,
      action: 'create_user_record_exception',
      message: `Exception creating user record: ${error.message}`,
      data: { error, stack: error.stack },
    });
    return { success: false, error: error.message };
  }
};

/**
 * Assign a role to a user for a specific solution
 * @param userEmail Email of the user to assign the role to
 * @param roleName Role to assign (admin, user, etc)
 * @param solutionId ID of the solution
 * @returns Success status and any error
 */
export const assignUserRole = async (userEmail: string, roleName: Role, solutionId: string) => {
  try {
    logger.info({
      action: 'assign_user_role_start',
      message: `Assigning role ${roleName} to user ${userEmail} for solution ${solutionId}`,
      data: { userEmail, roleName, solutionId },
    });

    // Use the assign_user_role database function
    const { error } = await supabase.rpc('assign_user_role', {
      in_user_email: userEmail,
      in_role_name: roleName,
      in_solution_id: solutionId,
    });

    if (error) {
      logger.error({
        action: 'assign_user_role_error',
        message: `Failed to assign role to user: ${error.message}`,
        data: { userEmail, roleName, solutionId, error },
      });
      return { success: false, error: error.message };
    }

    logger.info({
      action: 'assign_user_role_success',
      message: `Role ${roleName} assigned to user ${userEmail} for solution ${solutionId}`,
      data: { userEmail, roleName, solutionId },
    });

    return { success: true, error: null };
  } catch (error: any) {
    logger.error({
      action: 'assign_user_role_exception',
      message: `Exception assigning role to user: ${error.message}`,
      data: { userEmail, roleName, solutionId, error, stack: error.stack },
    });
    return { success: false, error: error.message };
  }
};
