
import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient, QueryKey, QueryFunction } from "@tanstack/react-query";
import { dispatchUserActionSubmit, dispatchUserActionError } from "@/utils";

interface PrefetchOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Hook para prefetch e gerenciamento de queries com rastreamento de performance integrado
 */
export function usePrefetchQuery<TData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  options: PrefetchOptions = {},
  user?: any
) {
  const queryClient = useQueryClient();
  const { enabled = true, staleTime = 1000 * 60 * 5, gcTime = 1000 * 60 * 10 } = options;
  
  // Define a função de prefetch
  const prefetch = useCallback(async () => {
    try {
      dispatchUserActionSubmit("prefetch_data", "usePrefetchQuery", { queryKey }, user);
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
        gcTime
      });
    } catch (error) {
      console.error(`Error prefetching query ${queryKey}:`, error);
      dispatchUserActionError(
        "prefetch_data", 
        "usePrefetchQuery", 
        error instanceof Error ? error.message : "Error prefetching data",
        { queryKey },
        user
      );
    }
  }, [queryClient, queryKey, queryFn, staleTime, gcTime, user]);

  // Prefetch na montagem se habilitado
  useEffect(() => {
    if (enabled) {
      console.log(`Prefetching data for ${queryKey.join('.')}`);
      prefetch();
    }
  }, [enabled, prefetch, queryKey]);

  // Usa a query normalmente
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
    enabled
  });

  return {
    ...query,
    prefetch,
  };
}
