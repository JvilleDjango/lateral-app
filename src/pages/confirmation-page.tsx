import { ArrowRight, CalendarDays, CircleCheck, Mail, MapPin, Users } from "lucide-react";
import { DateTime } from "luxon";
import { Link, useParams } from "react-router";
import { useBooking } from "../features/bookings";
import { useStay } from "../features/stays";
import styles from "./confirmation-page.module.css";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ConfirmationPage = () => {
  const { bookingId = "" } = useParams();
  const bookingQuery = useBooking(bookingId);
  // Defer the stay request until the booking identifies which property was confirmed.
  const stayQuery = useStay(bookingQuery.data?.stayId ?? "");

  if (bookingQuery.isPending || (bookingQuery.data && stayQuery.isPending)) {
    return (
      <section
        className={styles.confirmationPage}
        aria-label="Loading booking confirmation"
        aria-busy="true"
      >
        <div className={styles.confirmationPage__loading} />
      </section>
    );
  }

  if (bookingQuery.isError || !bookingQuery.data || stayQuery.isError || !stayQuery.data) {
    return (
      <section
        className={`${styles.confirmationPage} ${styles.confirmationPage__state}`}
        role="alert"
      >
        <p className={styles.confirmationPage__eyebrow}>Confirmation unavailable</p>
        <h1>We couldn't find this booking.</h1>
        <p>Demo bookings are stored in memory and reset when the API restarts.</p>
        <Link to="/">Return to available stays</Link>
      </section>
    );
  }

  const booking = bookingQuery.data;
  const stay = stayQuery.data;
  const checkIn = DateTime.fromISO(booking.checkIn);
  const checkOut = DateTime.fromISO(booking.checkOut);

  return (
    <div className={styles.confirmationPage} aria-live="polite">
      <header className={styles.confirmationPage__hero}>
        <CircleCheck size={48} strokeWidth={1.7} aria-hidden="true" />
        <p className={styles.confirmationPage__eyebrow}>Booking confirmed</p>
        <h1>You're going to {stay.location.split(",")[0]}.</h1>
        <p>
          A confirmation has been prepared for <strong>{booking.guestEmail}</strong>.
        </p>
        <div className={styles.confirmationPage__reference}>
          <span>Booking reference</span>
          <strong>{booking.id}</strong>
        </div>
      </header>
      <section className={styles.confirmationPage__confirmation} aria-labelledby="trip-heading">
        <div className={styles.confirmationPage__image}>
          <img src={stay.imageUrl} alt={stay.imageAlt} />
        </div>
        <div className={styles.confirmationPage__details}>
          <p className={styles.confirmationPage__location}>
            <MapPin size={15} aria-hidden="true" />
            {stay.location}
          </p>
          <h2 id="trip-heading">{stay.name}</h2>
          <dl className={styles.confirmationPage__tripDetails}>
            <div>
              <dt>
                <CalendarDays size={17} aria-hidden="true" />
                Check in
              </dt>
              <dd>{checkIn.toLocaleString(DateTime.DATE_MED)}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays size={17} aria-hidden="true" />
                Check out
              </dt>
              <dd>{checkOut.toLocaleString(DateTime.DATE_MED)}</dd>
            </div>
            <div>
              <dt>
                <Users size={17} aria-hidden="true" />
                Guests
              </dt>
              <dd>{booking.guests}</dd>
            </div>
            <div>
              <dt>
                <Mail size={17} aria-hidden="true" />
                Guest
              </dt>
              <dd>{booking.guestName}</dd>
            </div>
          </dl>
          <div className={styles.confirmationPage__total}>
            <span>Confirmed total</span>
            <strong>{currency.format(booking.total)}</strong>
            <small>
              {booking.nights} nights, including {currency.format(booking.serviceFee)} service fee
            </small>
          </div>
        </div>
      </section>
      <div className={styles.confirmationPage__nextSteps}>
        <div>
          <h2>What happens next</h2>
          <p>
            This is a mocked reservation, so no charge or email will be sent. In a production flow,
            trip details and cancellation terms would arrive by email.
          </p>
        </div>
        <Link to="/">
          Explore more stays <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
