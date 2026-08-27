import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/main-layout";
import RouteErrorBoundary from "../components/error-boundary/error-boundary";
import BrowsePage from "../pages/browse-page";
import CheckoutPage from "../pages/checkout-page";
import ConfirmationPage from "../pages/confirmation-page";
import NotFoundPage from "../pages/not-found-page";
import StayPage from "../pages/stay-page";

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: BrowsePage },
      { path: "stays/:stayId", Component: StayPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "booking/:bookingId", Component: ConfirmationPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
