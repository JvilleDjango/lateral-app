import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    // Avoid noisy focus refetches while retaining one retry for transient read failures.
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});
