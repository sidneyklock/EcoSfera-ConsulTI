import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthentication = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getSession = async () => {
      try {
        setAuthState(prevState => ({ ...prevState, loading: true, error: null }));

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Fetch user profile from the 'users' table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            setAuthState(prevState => ({ ...prevState, error: profileError.message }));
            return;
          }

          const createUserObject = (authUser: any, profile: any) => {
            return {
              id: authUser.id,
              email: authUser.email,
              name: profile?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
              avatar_url: authUser.user_metadata?.avatar_url,
              role: profile?.role || 'user' // Adicionando uma role padrão
            };
          };

          // Create user object
          const user = createUserObject(session.user, profile);

          setAuthState({ user: user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        setAuthState({ user: null, loading: false, error: error.message });
      } finally {
        setAuthState(prevState => ({ ...prevState, loading: false }));
      }
    };

    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      getSession();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
  };
};
