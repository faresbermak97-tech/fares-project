/**
 * Centralized logging utility
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Maximum logs to store in memory
  private currentLogLevel: LogLevel = LogLevel.INFO;

  /**
   * Sets the minimum log level
   * @param level - Minimum log level to display
   */
  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * Logs a debug message
   * @param message - Message to log
   * @param context - Additional context data
   */
  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Logs an info message
   * @param message - Message to log
   * @param context - Additional context data
   */
  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Logs a warning message
   * @param message - Message to log
   * @param context - Additional context data
   */
  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Logs an error message
   * @param message - Message to log
   * @param context - Additional context data
   */
  public error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Gets all stored logs
   * @returns Array of log entries
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clears all stored logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.currentLogLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    // Store log in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console
    const logMethod = this.getConsoleMethod(level);
    logMethod(
      `[${LogLevel[level]}] ${message}`,
      context ? '
Context:' : '',
      context || ''
    );
  }

  private getConsoleMethod(level: LogLevel): Console['log'] {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }
}

export const logger = new Logger();
