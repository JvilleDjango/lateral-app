// src/App.tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router";
import { router } from "./routes/app-routes";
import AppErrorFallback from "./components/error-boundary/app-error-fallback";

const App = () => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={AppErrorFallback}
        >
          <RouterProvider router={router} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default App;
