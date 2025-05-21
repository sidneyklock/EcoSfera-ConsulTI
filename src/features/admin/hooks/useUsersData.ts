
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

interface UsersData {
  users: User[];
}

export function useUsersData() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UsersData> => {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name');
      
      if (usersError) throw new Error(`Error fetching users: ${usersError.message}`);
      
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.full_name || user.email.split('@')[0],
          role: 'user' // Default role, would be fetched in a real application
        }))
      };
    }
  });

  return { data, isLoading, error, refetch };
}
