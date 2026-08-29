import { DateTime } from "luxon";
import { useSearchParams } from "react-router";
import { SearchForm, StayResults, type StaySearchParams } from "../features/stays";
import styles from "./browse-page.module.css";

const BrowsePage = () => {
  const [searchParams] = useSearchParams();
  // Offer a useful three-night trip by default without writing defaults into the URL.
  const defaultCheckIn = DateTime.now().plus({ days: 14 }).toISODate() ?? "";
  const defaultCheckOut = DateTime.now().plus({ days: 17 }).toISODate() ?? "";
  const guestParam = Number(searchParams.get("guests") ?? 2);
  const values: StaySearchParams = {
    destination: searchParams.get("destination")?.trim() ?? "",
    checkIn: searchParams.get("checkIn") ?? defaultCheckIn,
    checkOut: searchParams.get("checkOut") ?? defaultCheckOut,
    guests: Number.isInteger(guestParam) && guestParam >= 1 && guestParam <= 6 ? guestParam : 2,
  };
  const activeSearch = searchParams.toString();

  return (
    <div className={styles.browsePage}>
      <section className={styles.browsePage__hero}>
        <div className={styles.browsePage__heroInner}>
          <p className={styles.browsePage__eyebrow}>Curated escapes</p>
          <h1>Find somewhere worth going.</h1>
          <p className={styles.browsePage__intro}>
            Memorable stays for slower weekends, selected for their setting and sense of place.
          </p>
          {/* Remount uncontrolled fields when browser navigation changes the URL search state. */}
          <SearchForm key={activeSearch} values={values} />
        </div>
      </section>
      <section className={styles.browsePage__resultsSection} aria-labelledby="results-heading">
        <div className={styles.browsePage__resultsHeadingRow}>
          <div>
            <p className={styles.browsePage__eyebrow}>Explore the collection</p>
            <h2 id="results-heading">
              {values.destination ? `Stays near ${values.destination}` : "Available stays"}
            </h2>
          </div>
          {activeSearch && (
            <a className={styles.browsePage__clearSearch} href="/">
              Clear search
            </a>
          )}
        </div>
        <StayResults params={values} search={activeSearch ? `?${activeSearch}` : ""} />
      </section>
    </div>
  );
};
export default BrowsePage;
