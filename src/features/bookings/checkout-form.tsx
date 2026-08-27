import { useState, type SubmitEvent } from "react";
import { CreditCard, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router";
import type { BookingInput } from "../../../shared/schemas";
import { checkoutFormSchema } from "./checkout-schema";
import { useCreateBooking } from "./use-bookings";
import styles from "./checkout-form.module.css";

type BookingIntent = Pick<BookingInput, "stayId" | "checkIn" | "checkOut" | "guests">;

interface CheckoutFormProps {
  intent: BookingIntent;
}

const CheckoutForm = ({ intent }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const booking = useCreateBooking();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = checkoutFormSchema.safeParse(Object.fromEntries(formData));

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
    // Card fields validate the mock flow but never leave the browser or enter application state.
    booking.mutate(
      {
        ...intent,
        guestName: parsed.data.guestName,
        guestEmail: parsed.data.guestEmail,
        paymentToken: "mock-payment-approved",
      },
      { onSuccess: (confirmed) => navigate(`/booking/${confirmed.id}`) },
    );
  };

  const fieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <form
      className={styles.checkoutForm}
      onSubmit={handleSubmit}
      onChange={() => booking.reset()}
      noValidate
    >
      <section aria-labelledby="guest-heading">
        <div className={styles.checkoutForm__sectionHeading}>
          <span>1</span>
          <div>
            <h2 id="guest-heading">Guest details</h2>
            <p>We'll send the confirmation to this address.</p>
          </div>
        </div>
        <div className={styles.checkoutForm__fields}>
          <label>
            <span>Full name</span>
            <input
              name="guestName"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(fieldError("guestName"))}
              aria-describedby={fieldError("guestName") ? "guest-name-error" : undefined}
            />
            {fieldError("guestName") && (
              <small id="guest-name-error">{fieldError("guestName")}</small>
            )}
          </label>
          <label>
            <span>Email address</span>
            <input
              name="guestEmail"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(fieldError("guestEmail"))}
              aria-describedby={fieldError("guestEmail") ? "guest-email-error" : undefined}
            />
            {fieldError("guestEmail") && (
              <small id="guest-email-error">{fieldError("guestEmail")}</small>
            )}
          </label>
        </div>
      </section>
      <section aria-labelledby="payment-heading">
        <div className={styles.checkoutForm__sectionHeading}>
          <span>2</span>
          <div>
            <h2 id="payment-heading">Payment</h2>
            <p>Payment is mocked for this assessment.</p>
          </div>
        </div>
        <div className={styles.checkoutForm__mockNotice}>
          <CreditCard size={18} aria-hidden="true" />
          <p>
            Use any 16-digit card number, future-style expiry, and CVC. No payment data is stored.
          </p>
        </div>
        <div className={styles.checkoutForm__fields}>
          <label className={styles.checkoutForm__fullWidth}>
            <span>Name on card</span>
            <input
              name="cardName"
              type="text"
              autoComplete="cc-name"
              aria-invalid={Boolean(fieldError("cardName"))}
              aria-describedby={fieldError("cardName") ? "card-name-error" : undefined}
            />
            {fieldError("cardName") && <small id="card-name-error">{fieldError("cardName")}</small>}
          </label>
          <label className={styles.checkoutForm__fullWidth}>
            <span>Card number</span>
            <input
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              aria-invalid={Boolean(fieldError("cardNumber"))}
              aria-describedby={fieldError("cardNumber") ? "card-number-error" : undefined}
            />
            {fieldError("cardNumber") && (
              <small id="card-number-error">{fieldError("cardNumber")}</small>
            )}
          </label>
          <label>
            <span>Expiry</span>
            <input
              name="expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              aria-invalid={Boolean(fieldError("expiry"))}
              aria-describedby={fieldError("expiry") ? "expiry-error" : undefined}
            />
            {fieldError("expiry") && <small id="expiry-error">{fieldError("expiry")}</small>}
          </label>
          <label>
            <span>CVC</span>
            <input
              name="cvc"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              aria-invalid={Boolean(fieldError("cvc"))}
              aria-describedby={fieldError("cvc") ? "cvc-error" : undefined}
            />
            {fieldError("cvc") && <small id="cvc-error">{fieldError("cvc")}</small>}
          </label>
        </div>
      </section>
      {Object.keys(fieldErrors).length > 0 && (
        <p className={styles.checkoutForm__validationSummary} role="alert">
          Please correct the highlighted checkout fields.
        </p>
      )}
      {booking.isError && (
        <p className={styles.checkoutForm__submitError} role="alert">
          {booking.error.message}
        </p>
      )}
      <button
        className={styles.checkoutForm__submitButton}
        type="submit"
        disabled={booking.isPending}
      >
        <LockKeyhole size={17} aria-hidden="true" />
        {booking.isPending ? "Confirming booking..." : "Confirm booking"}
      </button>
      <p className={styles.checkoutForm__terms}>
        By confirming, you agree to this demo's mocked booking terms.
      </p>
    </form>
  );
};

export default CheckoutForm;
