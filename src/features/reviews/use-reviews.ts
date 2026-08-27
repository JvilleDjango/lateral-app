import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReviewInput } from "../../../shared/schemas";
import { createReview, getReviews } from "./reviews-api";

export function useReviews(stayId: string) {
  return useQuery({
    queryKey: ["stays", stayId, "reviews"],
    queryFn: ({ signal }) => getReviews(stayId, signal),
    enabled: Boolean(stayId),
  });
}

export function useCreateReview(stayId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewInput) => createReview(stayId, input),
    onSuccess: async () => {
      // Refetch the server-owned list instead of maintaining a second optimistic shape.
      await queryClient.invalidateQueries({ queryKey: ["stays", stayId, "reviews"] });
    },
  });
}
