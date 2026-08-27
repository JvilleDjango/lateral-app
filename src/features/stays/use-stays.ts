import { useQuery } from "@tanstack/react-query";
import { getStays, type StaySearchParams } from "./stays-api";

export function useStays(params: StaySearchParams) {
  return useQuery({
    // Search inputs belong in the key so each URL-backed result set is cached independently.
    queryKey: ["stays", params],
    queryFn: ({ signal }) => getStays(params, signal),
  });
}
