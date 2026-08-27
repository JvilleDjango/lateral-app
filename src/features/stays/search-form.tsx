import { useState, type SubmitEvent } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { DateTime } from "luxon";
import { Form } from "react-router";
import type { StaySearchParams } from "./stays-api";
import styles from "./search-form.module.css";

interface SearchFormProps {
  values: StaySearchParams;
}

const SearchForm = ({ values }: SearchFormProps) => {
  const today = DateTime.now().startOf("day").toISODate() ?? "";
  const [checkIn, setCheckIn] = useState(values.checkIn);
  const [checkOut, setCheckOut] = useState(values.checkOut);
  const [dateError, setDateError] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      event.preventDefault();
      setDateError("Check-out must be after check-in.");
      return;
    }
    setDateError("");
  };

  return (
    <Form
      className={styles.form}
      method="get"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className={`${styles.field} ${styles.destination}`}>
        <label htmlFor="destination">
          <MapPin size={16} aria-hidden="true" />
          Where
        </label>
        <input
          id="destination"
          name="destination"
          type="search"
          defaultValue={values.destination}
          placeholder="City or region"
          autoComplete="address-level2"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="checkIn">
          <CalendarDays size={16} aria-hidden="true" />
          Check in
        </label>
        <input
          id="checkIn"
          name="checkIn"
          type="date"
          min={today}
          value={checkIn}
          onChange={(event) => {
            setCheckIn(event.target.value);
            setDateError("");
          }}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="checkOut">
          <CalendarDays size={16} aria-hidden="true" />
          Check out
        </label>
        <input
          id="checkOut"
          name="checkOut"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(event) => {
            setCheckOut(event.target.value);
            setDateError("");
          }}
          required
          aria-describedby={dateError ? "date-error" : undefined}
          aria-invalid={Boolean(dateError)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="guests">
          <Users size={16} aria-hidden="true" />
          Guests
        </label>
        <select id="guests" name="guests" defaultValue={values.guests}>
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>
      <button className={styles.button} type="submit">
        <Search size={19} aria-hidden="true" />
        <span>Search stays</span>
      </button>
      {dateError && (
        <p className={styles.error} id="date-error" role="alert">
          {dateError}
        </p>
      )}
    </Form>
  );
};

export default SearchForm;
