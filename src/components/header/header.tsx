import { Compass } from "lucide-react";
import { Link } from "react-router";
import styles from "./header.module.css";

const Header = () => {
  return (
    <header className={styles.siteHeader}>
      <Link className={styles.siteHeader__brand} to="/" aria-label="Wayfare home">
        <Compass aria-hidden="true" size={24} strokeWidth={2.25} />
        <span>Wayfare</span>
      </Link>
      <span className={styles.siteHeader__note}>Considered stays, closer to nature</span>
    </header>
  );
};

export default Header;
