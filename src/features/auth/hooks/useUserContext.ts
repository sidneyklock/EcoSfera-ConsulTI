
import { useMemo } from "react";
import { User, Role } from "@/types";
import { useAuthStore } from "@/stores/authStore";

interface UserContextData {
  user: User | null;
  role: Role | null;
  solutionId: string | null;
}

/**
 * Hook to provide user context data with optimized re-renders
 */
export function useUserContext() {
  const { user, role, solutionId, isLoading, error, refreshContext } = useAuthStore();
  
  // Validate role type safety early to avoid re-renders
  // Only re-validate when role changes
  const validatedRole = useMemo(() => {
    // Only cast if role is a valid Role type or null
    const validRoles: Role[] = ["anon", "user", "admin", "system", "member", "owner"];
    return (role && typeof role === 'string' && validRoles.includes(role as Role)) 
      ? role as Role 
      : null;
  }, [role]);
  
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
