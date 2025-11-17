/**
 * Centralized error handling utility
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

class ErrorHandler {
  private errors: ErrorReport[] = [];
  private maxErrors = 100; // Maximum errors to store in memory

  /**
   * Handles and logs an error with context
   * @param error - The error to handle
   * @param context - Additional context about where the error occurred
   */
  public handleError(error: Error, context: ErrorContext = {}): void {
    const report: ErrorReport = {
      error,
      context,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Store error in memory
    this.errors.push(report);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error to console
    console.error('Error caught:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: report.timestamp,
    });

    // Here you could also send errors to an external service
    // this.sendToErrorService(report);
  }

  /**
   * Gets all stored error reports
   * @returns Array of error reports
   */
  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  /**
   * Clears all stored errors
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Creates a wrapped version of a function that automatically catches errors
   * @param fn - Function to wrap
   * @param context - Default context for errors
   * @returns Wrapped function
   */
  public wrapFunction<T extends (...args: any[]) => any>(
    fn: T,
    context: ErrorContext = {}
  ): (...args: Parameters<T>) => ReturnType<T> | void {
    return (...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error as Error, context);
      }
    };
  }
}

export const errorHandler = new ErrorHandler();

// Global error handler for uncaught errors
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    errorHandler.handleError(error || new Error(message as string), {
      component: 'Global',
      action: 'Uncaught Error',
      metadata: { source, lineno, colno },
    });
    return false;
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    errorHandler.handleError(event.reason, {
      component: 'Global',
      action: 'Unhandled Promise Rejection',
    });
  };
}
