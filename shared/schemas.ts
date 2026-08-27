import { z } from "zod";

export const reviewInputSchema = z.object({
  author: z.string().trim().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(500),
});

export const bookingInputSchema = z
  .object({
    stayId: z.string().min(1),
    guestName: z.string().trim().min(2).max(80),
    guestEmail: z.email(),
    checkIn: z.iso.date(),
    checkOut: z.iso.date(),
    guests: z.number().int().min(1).max(12),
    paymentToken: z.string().min(1),
  })
  // ISO dates sort chronologically, avoiding locale parsing in the shared contract.
  .refine((value) => value.checkOut > value.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type BookingInput = z.infer<typeof bookingInputSchema>;
