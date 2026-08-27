import type { Review } from "../../../shared/domain";
import type { ReviewInput } from "../../../shared/schemas";
import { apiGet, apiPost } from "../../api/api-client";

export function getReviews(stayId: string, signal?: AbortSignal) {
  return apiGet<Review[]>(`/api/stays/${stayId}/reviews`, signal);
}

export function createReview(stayId: string, input: ReviewInput) {
  return apiPost<Review, ReviewInput>(`/api/stays/${stayId}/reviews`, input);
}
