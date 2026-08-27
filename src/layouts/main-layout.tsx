import { Outlet } from "react-router";
import Header from "../components/header/header";
import styles from "./main-layout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
