import type { ApiError } from "../../shared/domain";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, error: ApiError["error"]) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = error.code;
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });

  if (!response.ok) {
    const fallback: ApiError = {
      error: {
        code: "REQUEST_FAILED",
        message: "We couldn't complete that request. Please try again.",
      },
    };
    const body = await response.json().catch(() => fallback) as ApiError;
    throw new ApiClientError(response.status, body.error);
  }

  return response.json() as Promise<T>;
}
