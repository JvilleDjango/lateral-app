export const SERVICE_FEE_RATE = 0.12;

export function calculateBookingPrice(pricePerNight: number, nights: number) {
  const subtotal = pricePerNight * nights;
  // The product displays whole-dollar prices, so the fee is rounded once at its boundary.
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

  return {
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
}
