import type { Booking } from "../../../shared/domain";
import type { BookingInput } from "../../../shared/schemas";
import { apiGet, apiPost } from "../../api/api-client";

export function createBooking(input: BookingInput) {
  return apiPost<Booking, BookingInput>("/api/bookings", input);
}

export function getBooking(bookingId: string, signal?: AbortSignal) {
  return apiGet<Booking>(`/api/bookings/${bookingId}`, signal);
}
