import type { FallbackProps } from "react-error-boundary";

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
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
