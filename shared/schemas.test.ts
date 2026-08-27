import { describe, expect, it } from "vitest";
import { bookingInputSchema, reviewInputSchema } from "./schemas.ts";

const validBooking = {
  stayId: "sonoran-casita",
  guestName: "Jeremy Smith",
  guestEmail: "jeremy@example.com",
  checkIn: "2026-10-10",
  checkOut: "2026-10-13",
  guests: 2,
  paymentToken: "mock-payment-token",
};

describe("bookingInputSchema", () => {
  it("accepts a valid booking and trims the guest name", () => {
    const result = bookingInputSchema.parse({ ...validBooking, guestName: "  Jeremy Smith  " });
    expect(result.guestName).toBe("Jeremy Smith");
  });

  it("rejects a checkout date that is not after check-in", () => {
    const result = bookingInputSchema.safeParse({
      ...validBooking,
      checkOut: validBooking.checkIn,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.checkOut).toContain(
        "Check-out must be after check-in",
      );
    }
  });

  it("rejects invalid calendar dates and party sizes", () => {
    expect(
      bookingInputSchema.safeParse({ ...validBooking, checkIn: "2026-02-30", guests: 0 }).success,
    ).toBe(false);
  });
});

describe("reviewInputSchema", () => {
  it("rejects ratings and comments outside their allowed ranges", () => {
    const result = reviewInputSchema.safeParse({ author: "J", rating: 6, comment: "Too short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.error.flatten().fieldErrors)).toEqual([
        "author",
        "rating",
        "comment",
      ]);
    }
  });
});
