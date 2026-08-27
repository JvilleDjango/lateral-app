import { CalendarDays, MapPin, Users } from "lucide-react";
import { DateTime } from "luxon";
import type { Stay } from "../../../shared/domain";
import { calculateBookingPrice } from "../../../shared/pricing";
import styles from "./booking-summary.module.css";

interface BookingSummaryProps {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const BookingSummary = ({ stay, checkIn, checkOut, guests }: BookingSummaryProps) => {
  const start = DateTime.fromISO(checkIn);
  const end = DateTime.fromISO(checkOut);
  const nights = Math.max(0, Math.round(end.diff(start, "days").days));
  const price = calculateBookingPrice(stay.pricePerNight, nights);

  return (
    <aside className={styles.bookingSummary} aria-label="Booking summary">
      <img src={stay.imageUrl} alt={stay.imageAlt} />
      <div className={styles.bookingSummary__body}>
        <p className={styles.bookingSummary__location}>
          <MapPin size={14} aria-hidden="true" />
          {stay.location}
        </p>
        <h2>{stay.name}</h2>
        <dl className={styles.bookingSummary__tripDetails}>
          <div>
            <dt>
              <CalendarDays size={16} aria-hidden="true" />
              Dates
            </dt>
            <dd>
              {start.toLocaleString(DateTime.DATE_MED)} - {end.toLocaleString(DateTime.DATE_MED)}
            </dd>
          </div>
          <div>
            <dt>
              <Users size={16} aria-hidden="true" />
              Guests
            </dt>
            <dd>
              {guests} {guests === 1 ? "guest" : "guests"}
            </dd>
          </div>
        </dl>
        <dl className={styles.bookingSummary__priceDetails}>
          <div>
            <dt>
              {currency.format(stay.pricePerNight)} x {nights} nights
            </dt>
            <dd>{currency.format(price.subtotal)}</dd>
          </div>
          <div>
            <dt>Wayfare service fee</dt>
            <dd>{currency.format(price.serviceFee)}</dd>
          </div>
          <div className={styles.bookingSummary__total}>
            <dt>Total</dt>
            <dd>{currency.format(price.total)}</dd>
          </div>
        </dl>
        <p className={styles.bookingSummary__note}>
          The API recalculates and confirms this total when you book.
        </p>
      </div>
    </aside>
  );
};

export default BookingSummary;
