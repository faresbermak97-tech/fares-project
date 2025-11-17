import { Response } from 'express';
import { AppError } from './errors';
import { errorHandler } from './errorHandler';

/**
 * Handles errors in API routes
 */
export function apiErrorHandler(error: Error, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        name: error.name,
        message: error.message,
        ...(error.context && { context: error.context }),
      },
    });
  } else {
    res.status(500).json({
      error: {
        name: 'InternalServerError',
        message: 'An unexpected error occurred',
      },
    });
  }

  // Log the error
  errorHandler.handleError(error, {
    path: res.req?.path,
    method: res.req?.method,
    body: res.req?.body,
    query: res.req?.query,
    params: res.req?.params,
  });
}

/**
 * Wraps async route handlers to catch errors
 */
export function asyncHandler<T>(
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  return (...args: any[]) => {
    const next = args[args.length - 1];
    return Promise.resolve(fn(...args)).catch(next);
  };
}

/**
 * Creates a wrapped version of a function that automatically catches errors
 * @param fn - Function to wrap
 * @param context - Default context for errors
 * @returns Wrapped function
 */
export function wrapFunction<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, unknown>
): (...args: Parameters<T>) => ReturnType<T> | void {
  return (...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler.handleError(error as Error, context);
    }
  };
}

/**
 * React error boundary fallback component
 */
export function ErrorFallback({ error }: { error: Error }) {
  errorHandler.handleError(error);

  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
}
