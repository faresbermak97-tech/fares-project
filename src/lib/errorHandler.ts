import { AppError } from "./errors";

export interface ErrorReport {
  error: Error;
  timestamp: Date;
  path?: string;
  method?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

class ErrorHandler {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  /**
   * Handles and logs an error with context
   * @param error - The error to handle
   * @param context - Additional context about where the error occurred
   */
  public handleError(error: Error, context: Partial<ErrorReport> = {}): void {
    const report: ErrorReport = {
      error,
      timestamp: new Date(),
      ...context,
    };

    // Store error in memory
    this.errors.push(report);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error based on type
    if (error instanceof AppError) {
      this.logAppError(error, report);
    } else {
      this.logUnexpectedError(error, report);
    }

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
   * Determines if an error is operational
   * @param error - Error to check
   * @returns Whether the error is operational
   */
  public isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  private logAppError(error: AppError, report: ErrorReport): void {
    console.error({
      type: "AppError",
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      context: error.context,
      timestamp: report.timestamp,
      path: report.path,
      method: report.method,
    });
  }

  private logUnexpectedError(error: Error, report: ErrorReport): void {
    console.error({
      type: "UnexpectedError",
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: report.timestamp,
      path: report.path,
      method: report.method,
    });
  }
}

export const errorHandler = new ErrorHandler();

// Global error handlers for uncaught errors
if (typeof window !== "undefined") {
  window.onerror = (message, source, lineno, colno, error) => {
    errorHandler.handleError(error || new Error(message as string), {
      path: source,
      userAgent: window.navigator.userAgent,
    });
    return false;
  };

  window.onunhandledrejection = (event) => {
    errorHandler.handleError(event.reason, {
      userAgent: window.navigator.userAgent,
    });
  };
}
