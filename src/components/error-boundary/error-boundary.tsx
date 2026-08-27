
import { isRouteErrorResponse, useRouteError } from "react-router";

const RouteErrorBoundary = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Something unexpected happened.";

  return (
    <main>
      <h1>We couldn’t load this page</h1>
      <p>{message}</p>
      <a href="/">Return to stays</a>
    </main>
  );
};

export default RouteErrorBoundary;
