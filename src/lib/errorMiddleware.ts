import { NextResponse } from 'next/server';
import { AppError } from './errors';
import { errorHandler } from './errorHandler';

/**
 * Handles errors in API routes
 */
export function apiErrorHandler(error: Error): NextResponse {
  // Log the error
  errorHandler.handleError(error);
  
  if (error instanceof AppError) {
    return NextResponse.json({
      error: {
        name: error.name,
        message: error.message,
        ...(error.context && { context: error.context }),
      },
    }, { status: error.statusCode });
  } else {
    return NextResponse.json({
      error: {
        name: 'InternalServerError',
        message: 'An unexpected error occurred',
      },
    }, { status: 500 });
  }
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
 * Error information object for client-side error handling
 */
export function getErrorInfo(error: Error) {
  errorHandler.handleError(error);
  
  return {
    error: {
      name: error.name,
      message: error.message
    }
  };
}
