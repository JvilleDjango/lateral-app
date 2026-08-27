import { DateTime } from "luxon";
import { Star, TriangleAlert } from "lucide-react";
import { useReviews } from "./use-reviews";
import styles from "./reviews.module.css";

interface ReviewListProps {
  stayId: string;
}

const ReviewList = ({ stayId }: ReviewListProps) => {
  const reviews = useReviews(stayId);

  if (reviews.isPending) {
    return (
      <div className={styles.reviewList__loading} aria-label="Loading reviews" aria-busy="true" />
    );
  }

  if (reviews.isError) {
    return (
      <div className={styles.reviewList__error} role="alert">
        <TriangleAlert size={20} aria-hidden="true" />
        <p>Reviews couldn't be loaded.</p>
        <button type="button" onClick={() => void reviews.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (reviews.data.length === 0) {
    return (
      <p className={styles.reviewList__empty}>No written reviews yet. Be the first to share one.</p>
    );
  }

  return (
    <div className={styles.reviewList}>
      {reviews.data.map((review) => (
        <article className={styles.reviewList__review} key={review.id}>
          <div className={styles.reviewList__heading}>
            <div className={styles.reviewList__avatar} aria-hidden="true">
              {review.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{review.author}</h3>
              <time dateTime={review.createdAt}>
                {DateTime.fromISO(review.createdAt).toLocaleString(DateTime.DATE_MED)}
              </time>
            </div>
          </div>
          <div className={styles.reviewList__stars} aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < review.rating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ))}
          </div>
          <p>{review.comment}</p>
        </article>
      ))}
    </div>
  );
};

export default ReviewList;
