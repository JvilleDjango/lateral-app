import { useMutation, useQuery } from "@tanstack/react-query";
import { createBooking, getBooking } from "./bookings-api";

export function useCreateBooking() {
  return useMutation({ mutationFn: createBooking });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: ({ signal }) => getBooking(bookingId, signal),
    enabled: Boolean(bookingId),
    // A missing confirmation is stable in this in-memory API, so retries only delay feedback.
    retry: false,
  });
}
