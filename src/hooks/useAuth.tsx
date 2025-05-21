
import { useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/types';
import { useSecureContextStore } from '@/stores/secureContextStore';

export type AuthState = {
  user: User | null;
  session: Session | null;
  role: Role | null;
  solutionId: string | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Centralized hook for authentication state
 * Combines Supabase auth and secure context
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    user, 
    role, 
    solutionId, 
    loading: contextLoading, 
    error: contextError,
    fetchUserContext,
    createUserRecord
  } = useSecureContextStore();

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Combined loading state
  const loading = isLoading || contextLoading;
  
  // Combined error state (prioritize auth error over context error)
  const combinedError = error || contextError;

  // Memoize the auth state to prevent unnecessary re-renders
  const authState = useMemo<AuthState>(() => ({
    user,
    session,
    role,
    solutionId,
    isLoading: loading,
    error: combinedError
  }), [user, session, role, solutionId, loading, combinedError]);

  useEffect(() => {
    console.log("useAuth: Initializing authentication state");
    
    // Set up listener for auth state changes first (to avoid missing events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("useAuth: Auth state changed", event);
      
      setSession(newSession);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Schedule async operations to avoid blocking
        setTimeout(() => {
          if (newSession?.user) {
            console.log("useAuth: User signed in, ensuring user record exists");
            
            // Create/update user record
            createUserRecord(newSession.user).catch(err => {
              console.error("Error creating user record:", err);
              setError(`Error creating user record: ${err.message}`);
            });
          }
          
          // Fetch updated user context
          fetchUserContext().catch(err => {
            console.error("Error fetching user context after auth change:", err);
            setError(`Error fetching context: ${err.message}`);
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAuth: User signed out");
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          // Fetch user context if we have a session
          await fetchUserContext();
        }
      } catch (err: any) {
        console.error("Error checking session:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserContext, createUserRecord]);

  return {
    ...authState,
    signOut,
    refreshContext: fetchUserContext
  };
}
