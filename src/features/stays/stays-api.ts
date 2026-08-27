import type { Stay } from "../../../shared/domain";
import { apiGet } from "../../api/api-client";

export interface StaySearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function getStays(params: StaySearchParams, signal?: AbortSignal) {
  const query = new URLSearchParams();

  if (params.destination) query.set("destination", params.destination);
  if (params.checkIn) query.set("checkIn", params.checkIn);
  if (params.checkOut) query.set("checkOut", params.checkOut);
  query.set("guests", String(params.guests));

  return apiGet<Stay[]>(`/api/stays?${query.toString()}`, signal);
}

export function getStay(stayId: string, signal?: AbortSignal) {
  return apiGet<Stay>(`/api/stays/${stayId}`, signal);
}
