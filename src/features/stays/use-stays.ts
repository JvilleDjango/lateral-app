import { useQuery } from "@tanstack/react-query";
import { getStays, type StaySearchParams } from "./stays-api";

export function useStays(params: StaySearchParams) {
  return useQuery({
    queryKey: ["stays", params],
    queryFn: ({ signal }) => getStays(params, signal),
  });
}
