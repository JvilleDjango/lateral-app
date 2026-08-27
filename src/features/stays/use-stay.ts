import { useQuery } from "@tanstack/react-query";
import { getStay } from "./stays-api";

export function useStay(stayId: string) {
  return useQuery({
    queryKey: ["stays", stayId],
    queryFn: ({ signal }) => getStay(stayId, signal),
    enabled: Boolean(stayId),
  });
}
