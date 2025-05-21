
import { useMemo } from "react";
import { User, Role } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface UserContextData {
  user: User | null;
  role: Role | null;
  solutionId: string | null;
}

/**
 * Hook to provide user context data with optimized re-renders
 */
export function useUserContext() {
  const { user, role, solutionId, isLoading, error, refreshContext } = useAuth();
  
  // Ensure role is of type Role or null by validating it
  const validatedRole = role as Role | null;
  
  // Memoize data object to prevent unnecessary re-renders
  const data = useMemo<UserContextData>(() => ({
    user,
    role: validatedRole,
    solutionId
  }), [user, validatedRole, solutionId]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: refreshContext 
  };
}
