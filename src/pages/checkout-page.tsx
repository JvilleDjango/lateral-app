import { ArrowLeft, ShieldCheck } from "lucide-react";
import { DateTime } from "luxon";
import { Link, useSearchParams } from "react-router";
import { BookingSummary, CheckoutForm } from "../features/bookings";
import { useStay } from "../features/stays";
import styles from "./checkout-page.module.css";

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const stayId = searchParams.get("stayId") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests"));
  const start = DateTime.fromISO(checkIn);
  const end = DateTime.fromISO(checkOut);
  // Treat the query string as untrusted input before fetching or constructing a booking intent.
  const validIntent =
    Boolean(stayId) &&
    start.isValid &&
    end.isValid &&
    end > start &&
    Number.isInteger(guests) &&
    guests > 0;
  const stayQuery = useStay(validIntent ? stayId : "");

  if (!validIntent) {
    return (
      <section className={`${styles.checkoutPage} ${styles.checkoutPage__state}`}>
        <p className={styles.checkoutPage__eyebrow}>Reservation details missing</p>
        <h1>Let's choose your stay first.</h1>
        <p>Checkout needs a property, valid dates, and a guest count.</p>
        <Link to="/">Browse available stays</Link>
      </section>
    );
  }

  if (stayQuery.isPending) {
    return (
      <section className={styles.checkoutPage} aria-label="Loading checkout" aria-busy="true">
        <div className={styles.checkoutPage__loading} />
      </section>
    );
  }

  if (stayQuery.isError || !stayQuery.data.available || guests > stayQuery.data.maxGuests) {
    return (
      <section className={`${styles.checkoutPage} ${styles.checkoutPage__state}`} role="alert">
        <p className={styles.checkoutPage__eyebrow}>Stay unavailable</p>
        <h1>We can't complete this reservation.</h1>
        <p>The stay may no longer be available or may not fit this guest count.</p>
        <Link to={`/stays/${stayId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}>
          Choose different details
        </Link>
      </section>
    );
  }

  const stay = stayQuery.data;

  return (
    <div className={styles.checkoutPage}>
      <Link
        className={styles.checkoutPage__backLink}
        to={`/stays/${stay.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to {stay.name}
      </Link>
      <header className={styles.checkoutPage__header}>
        <div>
          <p className={styles.checkoutPage__eyebrow}>Secure checkout</p>
          <h1>Confirm your stay</h1>
          <p>Review the trip, enter your details, and complete the mocked payment.</p>
        </div>
        <span>
          <ShieldCheck size={18} aria-hidden="true" />
          Secure mock checkout
        </span>
      </header>
      <div className={styles.checkoutPage__grid}>
        <CheckoutForm intent={{ stayId, checkIn, checkOut, guests }} />
        <BookingSummary stay={stay} checkIn={checkIn} checkOut={checkOut} guests={guests} />
      </div>
    </div>
  );
};

export default CheckoutPage;
