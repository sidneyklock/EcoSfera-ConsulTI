
import { useEffect } from "react";
import { useSecureContextStore } from "@/stores/secureContextStore";
import { User, Role } from "@/types";

interface UserContextData {
  user: User | null;
  role: Role | null;
  solutionId: string | null;
}

export function useUserContext() {
  const { 
    user, 
    role, 
    solutionId,
    loading: isLoading, 
    error, 
    fetchUserContext: refetch 
  } = useSecureContextStore();

  useEffect(() => {
    if (!user) {
      refetch();
    }
  }, [user, refetch]);

  const data: UserContextData = {
    user,
    role,
    solutionId
  };

  return { data, isLoading, error, refetch };
}
