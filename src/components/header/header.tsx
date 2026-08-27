import { Compass } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Wayfare home">
        <Compass aria-hidden="true" size={24} strokeWidth={2.25} />
        <span>Wayfare</span>
      </Link>
      <span className="header-note">Considered stays, closer to nature</span>
    </header>
  );
};

export default Header;
