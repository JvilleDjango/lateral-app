import { useState, type SubmitEvent } from "react";
import { CalendarDays, Users } from "lucide-react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router";
import type { Stay } from "../../../shared/domain";
import { calculateBookingPrice } from "../../../shared/pricing";
import styles from "./booking-panel.module.css";

interface BookingPanelProps {
  stay: Stay;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const BookingPanel = ({
  stay,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: BookingPanelProps) => {
  const navigate = useNavigate();
  const today = DateTime.now().startOf("day").toISODate() ?? "";
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [error, setError] = useState("");
  // This estimate improves decision-making; the API recalculates the authoritative total.
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(DateTime.fromISO(checkOut).diff(DateTime.fromISO(checkIn), "days").days),
        )
      : 0;
  const { subtotal, serviceFee, total } = calculateBookingPrice(stay.pricePerNight, nights);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nights < 1) {
      setError("Check-out must be after check-in.");
      return;
    }
    const query = new URLSearchParams({
      stayId: stay.id,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    navigate(`/checkout?${query.toString()}`);
  };

  return (
    <aside className={styles.bookingPanel} aria-label="Reservation estimate">
      <div className={styles.bookingPanel__priceHeading}>
        <p>
          <strong>{currency.format(stay.pricePerNight)}</strong> <span>per night</span>
        </p>
        <span
          className={
            stay.available
              ? styles.bookingPanel__availableStatus
              : styles.bookingPanel__unavailableStatus
          }
        >
          {stay.available ? "Available" : "Unavailable"}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.bookingPanel__dateFields}>
          <label>
            <span>
              <CalendarDays size={15} aria-hidden="true" />
              Check in
            </span>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setError("");
              }}
              required
            />
          </label>
          <label>
            <span>
              <CalendarDays size={15} aria-hidden="true" />
              Check out
            </span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setError("");
              }}
              required
              aria-invalid={Boolean(error)}
            />
          </label>
        </div>
        <label className={styles.bookingPanel__guestsField}>
          <span>
            <Users size={15} aria-hidden="true" />
            Guests
          </span>
          <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
            {Array.from({ length: stay.maxGuests }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p className={styles.bookingPanel__error} role="alert">
            {error}
          </p>
        )}
        {nights > 0 && (
          <dl className={styles.bookingPanel__breakdown}>
            <div>
              <dt>
                {currency.format(stay.pricePerNight)} x {nights} nights
              </dt>
              <dd>{currency.format(subtotal)}</dd>
            </div>
            <div>
              <dt>Wayfare service fee</dt>
              <dd>{currency.format(serviceFee)}</dd>
            </div>
            <div className={styles.bookingPanel__total}>
              <dt>Estimated total</dt>
              <dd>{currency.format(total)}</dd>
            </div>
          </dl>
        )}
        <button type="submit" disabled={!stay.available}>
          {stay.available ? "Reserve this stay" : "Not available for these dates"}
        </button>
        <p className={styles.bookingPanel__disclaimer}>
          You won't be charged yet. Final pricing is confirmed at checkout.
        </p>
      </form>
    </aside>
  );
};

export default BookingPanel;
