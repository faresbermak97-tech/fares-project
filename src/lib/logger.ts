type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isTest = process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.log(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.isTest) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isTest) return;

    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { error };
    const fullContext = { ...context, ...errorDetails };
    console.error(this.formatMessage("error", message, fullContext));

    // In production, send to error tracking service
    if (!this.isDevelopment && typeof window === "undefined") {
      // Example: Send to Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: fullContext });
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }
}

export const logger = new Logger();
