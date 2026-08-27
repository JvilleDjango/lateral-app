import { SearchX, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import type { StaySearchParams } from "./stays-api";
import StayCard from "./stay-card";
import { useStays } from "./use-stays";
import styles from "./stay-results.module.css";

interface StayResultsProps {
  params: StaySearchParams;
  search: string;
}

const StayResults = ({ params, search }: StayResultsProps) => {
  const staysQuery = useStays(params);

  if (staysQuery.isPending) {
    return (
      <div className={styles.grid} aria-label="Loading stays" aria-busy="true">
        {[1, 2, 3].map((item) => (
          <div className={styles.skeleton} key={item} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (staysQuery.isError) {
    return (
      <div className={styles.state} role="alert">
        <TriangleAlert size={28} aria-hidden="true" />
        <h3>We couldn't load these stays</h3>
        <p>Check your connection and try the search again.</p>
        <button type="button" onClick={() => void staysQuery.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (staysQuery.data.length === 0) {
    return (
      <div className={styles.state}>
        <SearchX size={28} aria-hidden="true" />
        <h3>No stays match this search</h3>
        <p>Try another destination or reduce the number of guests.</p>
        <Link to="/">Clear search</Link>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {staysQuery.data.map((stay) => (
        <StayCard key={stay.id} stay={stay} search={search} />
      ))}
    </div>
  );
};

export default StayResults;
