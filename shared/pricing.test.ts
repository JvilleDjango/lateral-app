import { describe, expect, it } from "vitest";
import { calculateBookingPrice } from "./pricing.ts";

describe("calculateBookingPrice", () => {
  it("calculates the stay subtotal and service fee", () => {
    expect(calculateBookingPrice(178, 3)).toEqual({ subtotal: 534, serviceFee: 64, total: 598 });
  });

  it("rounds a fractional service fee to the nearest whole dollar", () => {
    expect(calculateBookingPrice(101, 1)).toEqual({ subtotal: 101, serviceFee: 12, total: 113 });
  });
});
