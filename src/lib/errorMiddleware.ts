import { NextResponse } from "next/server";
import { errorHandler } from "./errorHandler";
import { AppError } from "./errors";

/**
 * Handles errors in API routes
 */
export function apiErrorHandler(error: Error): NextResponse {
  // Log the error
  errorHandler.handleError(error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          name: error.name,
          message: error.message,
          ...(error.context && { context: error.context }),
        },
      },
      { status: error.statusCode }
    );
  } else {
    return NextResponse.json(
      {
        error: {
          name: "InternalServerError",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Wraps async route handlers to catch errors
 */
export function asyncHandler<T extends (...args: unknown[]) => Promise<NextResponse>>(fn: T): T {
  return (async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        return apiErrorHandler(error);
      }
      // Handle cases where the thrown value is not an Error object
      const errorMessage = typeof error === "string" ? error : "An unknown error occurred";
      return apiErrorHandler(new Error(errorMessage));
    }
  }) as T;
}

/**
 * Creates a wrapped version of a function that automatically catches errors
 * @param fn - Function to wrap
 * @param context - Default context for errors
 * @returns Wrapped function
 */
export function wrapFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context?: Record<string, unknown>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>) => {
    try {
      return fn(...args) as ReturnType<T>;
    } catch (error) {
      errorHandler.handleError(error as Error, context);
      return undefined;
    }
  };
}

/**
 * Error information object for client-side error handling
 */
export function getErrorInfo(error: Error) {
  errorHandler.handleError(error);

  return {
    error: {
      name: error.name,
      message: error.message,
    },
  };
}
