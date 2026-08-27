import { Outlet } from "react-router";
import Header from "../components/header/header";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
