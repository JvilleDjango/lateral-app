import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router";
import type { Stay } from "../../../shared/domain";
import styles from "./stay-card.module.css";

interface StayCardProps {
  stay: Stay;
  search: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const StayCard = ({ stay, search }: StayCardProps) => {
  return (
    <article className={styles.card}>
      <Link
        className={styles.imageLink}
        to={`/stays/${stay.id}${search}`}
        aria-label={`View ${stay.name}`}
      >
        <img src={stay.imageUrl} alt={stay.imageAlt} loading="lazy" />
        {!stay.available && (
          <span className={styles.availabilityBadge}>Next dates unavailable</span>
        )}
      </Link>
      <div className={styles.body}>
        <div className={styles.heading}>
          <div>
            <p className={styles.location}>
              <MapPin size={14} aria-hidden="true" />
              {stay.location}
            </p>
            <h3>
              <Link to={`/stays/${stay.id}${search}`}>{stay.name}</Link>
            </h3>
          </div>
          <span
            className={styles.rating}
            aria-label={`${stay.rating} out of 5 stars`}
          >
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {stay.rating}
          </span>
        </div>
        <p className={styles.description}>{stay.description}</p>
        <div className={styles.meta}>
          <span>
            <Users size={15} aria-hidden="true" />
            Up to {stay.maxGuests}
          </span>
          <span>{stay.amenities[0]}</span>
        </div>
        <div className={styles.footer}>
          <p>
            <strong>{currency.format(stay.pricePerNight)}</strong>{" "}
            <span>night</span>
          </p>
          <Link className={styles.detailsLink} to={`/stays/${stay.id}${search}`}>
            View stay <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default StayCard;
