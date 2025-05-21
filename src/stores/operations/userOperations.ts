
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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
