export interface ErrorResponse {
  message: string;
  statusCode: number;
  path: string;
  timestamp: string;
}

// Extracts the backend error message from a fetch/API error response.
export const extractErrorMessage = async (
  err: unknown,
  fallback = 'An unexpected error occurred'
): Promise<string> => {
  try {
    const res = err as { json?: () => Promise<ErrorResponse> };
    if (typeof res.json === 'function') {
      const body = await res.json();
      if (body?.message) return body.message;
    }
  } catch {
    // ignore parse errors
  }
  if (err instanceof Error) return err.message;
  return fallback;
};
