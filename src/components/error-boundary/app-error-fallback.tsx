import type { FallbackProps } from "react-error-boundary";

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // Resetting also clears failed TanStack Query state through the boundary configured in App.
  const message = error instanceof Error ? error.message : "Something unexpected happened.";

  return (
    <main role="alert">
      <h1>Something went wrong</h1>
      <p>{message}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </main>
  );
};

export default AppErrorFallback;
