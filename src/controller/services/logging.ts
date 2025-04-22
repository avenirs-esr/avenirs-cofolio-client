import type { App } from '@vue/runtime-core';
import { authStore } from './auth';

// Log levels enum
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

// Configuration interface
interface LogConfig {
    minLevel: LogLevel;
    enableRemote: boolean;
    remoteUrl?: string;
    batchSize?: number;
}

// Log entry interface
interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    userId?: string;
    context?: any;
    tags?: string[];
}

class LoggingService {
    private config: LogConfig = {
        minLevel: LogLevel.INFO, // Default to INFO in production, can be overridden
        enableRemote: false,
        batchSize: 10
    };

    private logQueue: LogEntry[] = [];

    constructor() {
        // Set different defaults based on environment
        if (import.meta.env.DEV) {
            this.config.minLevel = LogLevel.DEBUG;
        }

        // Flush logs on window unload
        window.addEventListener('beforeunload', () => {
            this.flushLogs();
        });
    }

    /**
     * Configure the logging service
     */
    configure(config: Partial<LogConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Log a debug message
     */
    debug(message: string, context?: any, tags?: string[]): void {
        this.log(LogLevel.DEBUG, message, context, tags);
    }

    /**
     * Log an info message
     */
    info(message: string, context?: any, tags?: string[]): void {
        this.log(LogLevel.INFO, message, context, tags);
    }

    /**
     * Log a warning message
     */
    warn(message: string, context?: any, tags?: string[]): void {
        this.log(LogLevel.WARN, message, context, tags);
    }

    /**
     * Log an error message
     */
    error(message: string, context?: any, tags?: string[]): void {
        this.log(LogLevel.ERROR, message, context, tags);
    }

    /**
     * Internal method to handle logging
     */
    private log(level: LogLevel, message: string, context?: any, tags?: string[]): void {
        // Skip if below minimum log level
        if (level < this.config.minLevel) {
            return;
        }

        // Get current user ID from auth store if available
        const state = authStore.state as any;
        const userId = state?.user?.userId;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            userId,
            context,
            tags
        };

        // Always log to console in development
        if (import.meta.env.DEV) {
            this.logToConsole(entry);
        }

        // Add to queue for remote logging if enabled
        if (this.config.enableRemote) {
            this.logQueue.push(entry);

            // Send logs if we've reached batch size
            if (this.logQueue.length >= (this.config.batchSize || 10)) {
                this.flushLogs();
            }
        }
    }

    /**
     * Log to console with appropriate styling
     */
    private logToConsole(entry: LogEntry): void {
        const { level, message, userId, context } = entry;

        const userContext = userId ? `[User: ${userId}]` : '';
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();

        let consoleMethod: 'log' | 'info' | 'warn' | 'error' = 'log';
        let badge: string;

        switch (level) {
            case LogLevel.DEBUG:
                badge = 'DEBUG';
                consoleMethod = 'log';
                break;
            case LogLevel.INFO:
                badge = 'INFO';
                consoleMethod = 'info';
                break;
            case LogLevel.WARN:
                badge = 'WARN';
                consoleMethod = 'warn';
                break;
            case LogLevel.ERROR:
                badge = 'ERROR';
                consoleMethod = 'error';
                break;
            default:
                badge = 'LOG';
                consoleMethod = 'log';
        }

        console[consoleMethod](
            `${badge} [${timestamp}] ${userContext} ${message}`,
            context || ''
        );
    }

    /**
     * Send logs to remote server
     */
    flushLogs(): void {
        if (!this.config.enableRemote || this.logQueue.length === 0) {
            return;
        }

        const logsToSend = [...this.logQueue];
        this.logQueue = [];

        if (this.config.remoteUrl) {
            fetch(this.config.remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    logs: logsToSend,
                    app: 'vue-application', // App identifier
                    version: import.meta.env.VITE_APP_VERSION
                }),
                // Use keepalive to ensure logs are sent even if page is unloading
                keepalive: true
            }).catch(err => {
                // If remote logging fails, log to console as fallback
                console.error('Failed to send logs to remote server:', err);

                // Re-add logs to queue if we're not shutting down
                if (document.readyState !== 'unloading') {
                    this.logQueue = [...logsToSend, ...this.logQueue];
                }
            });
        }
    }

    install(app: App): void {
        // Make logger available as $logger in all components
        app.config.globalProperties.$logger = logger;

        // Add error handler to log unhandled errors
        app.config.errorHandler = (err, instance, info) => {
            // Extract component information if available
            const componentName = instance?.$.type?.name || 'UnknownComponent';

            this.error(
                `Unhandled error in ${componentName}: ${err}`,
                {
                    error: err,
                    info,
                    component: componentName,
                    props: instance?.$props,
                    route: instance?.$route?.path
                },
                ['vue-error']
            );

            // Log to console as well for development
            if (import.meta.env.DEV) {
                console.error(err);
            }
        };
    }
}

// Create singleton instance
const logger = new LoggingService();

export default logger;