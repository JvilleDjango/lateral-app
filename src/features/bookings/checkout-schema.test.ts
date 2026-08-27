import { afterEach, describe, expect, it, vi } from "vitest";
import { checkoutFormSchema } from "./checkout-schema.ts";

const validForm = {
  guestName: "Jeremy Smith",
  guestEmail: "jeremy@example.com",
  cardName: "Jeremy Smith",
  cardNumber: "4242 4242 4242 4242",
  expiry: "12/27",
  cvc: "123",
};

describe("checkoutFormSchema", () => {
  afterEach(() => vi.useRealTimers());

  it("normalizes a valid card number", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-26T12:00:00Z"));
    expect(checkoutFormSchema.parse(validForm).cardNumber).toBe("4242424242424242");
  });

  it("rejects an expired card and malformed payment fields", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-26T12:00:00Z"));
    const result = checkoutFormSchema.safeParse({
      ...validForm,
      cardNumber: "4242",
      expiry: "07/26",
      cvc: "12",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        cardNumber: ["Enter a 16-digit card number."],
        expiry: ["Use a future expiry date."],
        cvc: ["Enter a 3 or 4-digit security code."],
      });
    }
  });
});
