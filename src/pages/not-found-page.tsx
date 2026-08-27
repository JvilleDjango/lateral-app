import { Link } from "react-router";
import styles from "./static-page.module.css";

const NotFoundPage = () => {
  return (
    <section className={styles.staticPage}>
      <p className={styles.staticPage__eyebrow}>404</p>
      <h1>That path wandered off.</h1>
      <Link to="/">Return to stays</Link>
    </section>
  );
};

export default NotFoundPage;
