import { useState, type SubmitEvent } from "react";
import { Send } from "lucide-react";
import { reviewInputSchema } from "../../../shared/schemas";
import { useCreateReview } from "./use-reviews";
import styles from "./reviews.module.css";

interface ReviewFormProps {
  stayId: string;
}

const ReviewForm = ({ stayId }: ReviewFormProps) => {
  const createReview = useCreateReview(stayId);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    const form = event.currentTarget;
    const formData = new FormData(form);
    // Reuse the API schema so client feedback matches the server's accepted review shape.
    const parsed = reviewInputSchema.safeParse({
      author: formData.get("author"),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors(
        Object.fromEntries(
          Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1])),
        ),
      );
      return;
    }

    setFieldErrors({});
    createReview.mutate(parsed.data, {
      onSuccess: () => {
        form.reset();
        setSubmitted(true);
      },
    });
  };

  return (
    <form
      className={styles.reviewForm}
      onSubmit={handleSubmit}
      onChange={() => setSubmitted(false)}
      noValidate
    >
      <div className={styles.reviewForm__heading}>
        <p className={styles.reviewForm__eyebrow}>Share your experience</p>
        <h3>Add a review</h3>
      </div>
      <div className={styles.reviewForm__row}>
        <label>
          <span>Your name</span>
          <input
            name="author"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={fieldErrors.author ? "author-error" : undefined}
          />
          {fieldErrors.author && <small id="author-error">Enter at least 2 characters.</small>}
        </label>
        <label>
          <span>Rating</span>
          <select name="rating" defaultValue="5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} -{" "}
                {rating === 5
                  ? "Excellent"
                  : rating === 4
                    ? "Great"
                    : rating === 3
                      ? "Good"
                      : rating === 2
                        ? "Fair"
                        : "Poor"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>Your review</span>
        <textarea
          name="comment"
          rows={4}
          placeholder="What made this stay memorable?"
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={fieldErrors.comment ? "comment-error" : undefined}
        />
        {fieldErrors.comment && (
          <small id="comment-error">Write between 10 and 500 characters.</small>
        )}
      </label>
      {Object.keys(fieldErrors).length > 0 && (
        <p className={styles.reviewForm__error} role="alert">
          Please correct the highlighted review fields.
        </p>
      )}
      {createReview.isError && (
        <p className={styles.reviewForm__error} role="alert">
          {createReview.error.message}
        </p>
      )}
      {submitted && (
        <p className={styles.reviewForm__success} role="status">
          Thanks. Your review has been added.
        </p>
      )}
      <button type="submit" disabled={createReview.isPending}>
        <Send size={16} aria-hidden="true" />
        {createReview.isPending ? "Adding review..." : "Add review"}
      </button>
    </form>
  );
};

export default ReviewForm;
