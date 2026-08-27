import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.ts";

const bookingRequest = {
  stayId: "sonoran-casita",
  guestName: "Jeremy Smith",
  guestEmail: "jeremy@example.com",
  checkIn: "2026-10-10",
  checkOut: "2026-10-13",
  guests: 2,
  paymentToken: "mock-payment-token",
};

describe("booking API", () => {
  it("creates and retrieves a confirmed booking with a server-calculated total", async () => {
    const createResponse = await request(app)
      .post("/api/bookings")
      .send({ ...bookingRequest, total: 1 })
      .expect(201);
    expect(createResponse.body).toMatchObject({
      stayId: "sonoran-casita",
      status: "confirmed",
      nights: 3,
      subtotal: 534,
      serviceFee: 64,
      total: 598,
    });
    expect(createResponse.body.id).toMatch(/^WYF-[A-F0-9]{8}$/);

    const readResponse = await request(app)
      .get(`/api/bookings/${createResponse.body.id}`)
      .expect(200);
    expect(readResponse.body).toEqual(createResponse.body);
  });

  it("returns structured validation errors for an invalid date range", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ ...bookingRequest, checkOut: bookingRequest.checkIn })
      .expect(400);
    expect(response.body).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        fields: { checkOut: ["Check-out must be after check-in"] },
      },
    });
  });

  it("rejects an unavailable stay", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ ...bookingRequest, stayId: "alpine-lookout" })
      .expect(409);
    expect(response.body.error.code).toBe("STAY_UNAVAILABLE");
  });
});
