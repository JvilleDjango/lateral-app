import { useParams } from "react-router";
import styles from "./static-page.module.css";

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Booking confirmed</p>
      <h1>You are going.</h1>
      <p>Confirmation reference: {bookingId}</p>
    </section>
  );
};
export default ConfirmationPage;
