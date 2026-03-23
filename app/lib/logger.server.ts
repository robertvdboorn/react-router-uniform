/**
 * Server-Side Logger
 * 
 * Centralized logging with log levels and production/development modes.
 * In production, integrate with monitoring services (Sentry, Datadog, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

export class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  /**
   * Debug logs (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`🔵 [DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Info logs (always shown)
   */
  info(message: string, context?: LogContext) {
    console.log(`ℹ️  [INFO] ${message}`, context || '');
  }

  /**
   * Warning logs (always shown)
   */
  warn(message: string, context?: LogContext) {
    console.warn(`⚠️  [WARN] ${message}`, context || '');
  }

  /**
   * Error logs (always shown)
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(`❌ [ERROR] ${message}`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...context,
    });

    // In production, send to monitoring service
    if (!this.isDevelopment) {
      // TODO: Send to Sentry, Datadog, etc.
      // Example: Sentry.captureException(error);
    }
  }

  /**
   * Security event logging (always shown, with level)
   */
  security(
    event: string,
    data: Record<string, any>,
    level: LogLevel = 'info'
  ) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      event,
      environment: process.env.NODE_ENV,
      ...data,
    };

    const prefix = '🔒 [SECURITY]';

    switch (level) {
      case 'error':
        console.error(prefix, event, logData);
        break;
      case 'warn':
        console.warn(prefix, event, logData);
        break;
      case 'info':
      case 'debug':
      default:
        console.log(prefix, event, logData);
    }

    // In production, send to monitoring service
    if (!this.isDevelopment) {
      // TODO: Send to monitoring/audit service
    }
  }

  /**
   * Performance timing logs
   */
  perf(label: string, startTime: number) {
    const duration = Date.now() - startTime;
    if (this.isDevelopment) {
      console.log(`⏱️  [PERF] ${label}: ${duration}ms`);
    }
  }
}

// Export singleton logger instance
export const logger = new Logger();
