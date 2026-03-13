/**
 * Logger Service
 * Centralized logging with different severity levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  stack?: string;
  context?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  constructor() {
    // Default to development mode for non-production environments
    // process.env.NODE_ENV is set by Vite for browser and by Jest for tests
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, data } = entry;
    const prefix = context ? `[${context}]` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} ${level.toUpperCase()} ${prefix} ${message}${dataStr}`;
  }

  debug(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: 'debug',
      message,
      data,
      context,
    };
    this.addLog(entry);

    if (this.isDevelopment) {
      if (context) {
        console.debug(`[${context}] ${message}`, data);
      } else {
        console.debug(message, data);
      }
    }
  }

  info(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: 'info',
      message,
      data,
      context,
    };
    this.addLog(entry);

    if (this.isDevelopment) {
      if (context) {
        console.info(`[${context}] ${message}`, data);
      } else {
        console.info(message, data);
      }
    }
  }

  warn(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: 'warn',
      message,
      data,
      context,
    };
    this.addLog(entry);

    // Always log warnings
    if (context) {
      console.warn(`[${context}] ${message}`, data);
    } else {
      console.warn(message, data);
    }
  }

  error(message: string, error?: unknown, context?: string): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: 'error',
      message,
      context,
      data: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    };
    this.addLog(entry);

    // Always log errors
    if (context) {
      console.error(`[${context}] ${message}`, error);
    } else {
      console.error(message, error);
    }
  }

  /**
   * Get all accumulated logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();
