import { ArrowLeft, Check, MapPin, Star, Users } from "lucide-react";
import { DateTime } from "luxon";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { ApiClientError } from "../api/api-client";
import { ReviewForm, ReviewList } from "../features/reviews";
import { BookingPanel, useStay } from "../features/stays";
import styles from "./stay-page.module.css";

const StayPage = () => {
  const { stayId = "" } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stayQuery = useStay(stayId);

  if (stayQuery.isPending) {
    return (
      <section className={styles.stayPage} aria-label="Loading stay details" aria-busy="true">
        <div className={styles.stayPage__loading} />
      </section>
    );
  }

  if (stayQuery.isError) {
    // A missing fixture has different recovery guidance than a transient request failure.
    const notFound = stayQuery.error instanceof ApiClientError && stayQuery.error.status === 404;
    return (
      <section className={`${styles.stayPage} ${styles.stayPage__errorState}`} role="alert">
        <p className={styles.stayPage__eyebrow}>{notFound ? "Stay not found" : "Unable to load"}</p>
        <h1>{notFound ? "This stay is no longer here." : "We couldn't load this stay."}</h1>
        <p>
          {notFound
            ? "It may have been removed from the collection."
            : "Check your connection and try again."}
        </p>
        {notFound ? (
          <Link to="/">Browse available stays</Link>
        ) : (
          <button type="button" onClick={() => void stayQuery.refetch()}>
            Try again
          </button>
        )}
      </section>
    );
  }

  const stay = stayQuery.data;
  const defaultCheckIn = DateTime.now().plus({ days: 14 }).toISODate() ?? "";
  const defaultCheckOut = DateTime.now().plus({ days: 17 }).toISODate() ?? "";
  const requestedGuests = Number(searchParams.get("guests") ?? 2);
  // Clamp URL input to the selected stay before initializing the reservation control.
  const initialGuests = Number.isInteger(requestedGuests)
    ? Math.min(Math.max(requestedGuests, 1), stay.maxGuests)
    : 2;

  return (
    <div className={styles.stayPage}>
      <Link className={styles.stayPage__backLink} to={{ pathname: "/", search: location.search }}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back to stays
      </Link>
      <header className={styles.stayPage__header}>
        <div>
          <p className={styles.stayPage__eyebrow}>A Wayfare stay</p>
          <h1>{stay.name}</h1>
          <p className={styles.stayPage__location}>
            <MapPin size={16} aria-hidden="true" />
            {stay.location}
          </p>
        </div>
        <div
          className={styles.stayPage__rating}
          aria-label={`${stay.rating} out of 5 stars from ${stay.reviewCount} reviews`}
        >
          <Star size={18} fill="currentColor" aria-hidden="true" />
          <strong>{stay.rating}</strong>
          <span>{stay.reviewCount} reviews</span>
        </div>
      </header>
      <div className={styles.stayPage__heroImage}>
        <img src={stay.imageUrl} alt={stay.imageAlt} />
      </div>
      <div className={styles.stayPage__detailGrid}>
        <div className={styles.stayPage__summary}>
          <div className={styles.stayPage__summaryHeading}>
            <div>
              <p className={styles.stayPage__eyebrow}>The stay</p>
              <h2>A considered place to slow down</h2>
            </div>
            <span>
              <Users size={17} aria-hidden="true" />
              Up to {stay.maxGuests} guests
            </span>
          </div>
          <p className={styles.stayPage__description}>{stay.description}</p>
          <section className={styles.stayPage__amenities} aria-labelledby="amenities-heading">
            <h2 id="amenities-heading">What this place offers</h2>
            <ul>
              {stay.amenities.map((amenity) => (
                <li key={amenity}>
                  <Check size={17} aria-hidden="true" />
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <BookingPanel
          stay={stay}
          initialCheckIn={searchParams.get("checkIn") ?? defaultCheckIn}
          initialCheckOut={searchParams.get("checkOut") ?? defaultCheckOut}
          initialGuests={initialGuests}
        />
      </div>
      <section className={styles.stayPage__reviewsSection} aria-labelledby="reviews-heading">
        <div className={styles.stayPage__reviewsHeading}>
          <p className={styles.stayPage__eyebrow}>Guest perspective</p>
          <h2 id="reviews-heading">Recent reviews</h2>
          <p>Selected comments from {stay.reviewCount} verified stays.</p>
        </div>
        <div className={styles.stayPage__reviewsGrid}>
          <ReviewList stayId={stay.id} />
          <ReviewForm stayId={stay.id} />
        </div>
      </section>
    </div>
  );
};

export default StayPage;
