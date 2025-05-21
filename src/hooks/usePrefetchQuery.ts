
import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient, QueryKey, QueryFunction } from "@tanstack/react-query";
import { dispatchUserActionSubmit, dispatchUserActionError } from "@/utils";

interface PrefetchOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for data prefetching and query management with built-in performance tracking
 */
export function usePrefetchQuery<TData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  options: PrefetchOptions = {},
  user?: any
) {
  const queryClient = useQueryClient();
  const { enabled = true, staleTime = 1000 * 60 * 5, cacheTime = 1000 * 60 * 10 } = options;
  
  // Define the prefetch function
  const prefetch = useCallback(async () => {
    try {
      dispatchUserActionSubmit("prefetch_data", "usePrefetchQuery", { queryKey }, user);
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
        cacheTime
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
  }, [queryClient, queryKey, queryFn, staleTime, cacheTime, user]);

  // Prefetch on mount if enabled
  useEffect(() => {
    if (enabled) {
      console.log(`Prefetching data for ${queryKey.join('.')}`);
      prefetch();
    }
  }, [enabled, prefetch, queryKey]);

  // Use the query normally
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    enabled
  });

  return {
    ...query,
    prefetch,
  };
}
