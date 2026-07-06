import { isDevelopment, isProduction } from "../config/environment";

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

export interface IShowLog {
  context: string;
  data?: any;
  level?: LogLevel;
  timestamp?: boolean;
}

interface LoggerConfig {
  enabledInProduction: boolean;
  enabledLevels: LogLevel[];
  formatJson: boolean;
  showTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig = {
    enabledInProduction: true,
    enabledLevels: ["debug", "info", "warn", "error", "success"],
    formatJson: true,
    showTimestamp: true,
  };

  private shouldLog(level: LogLevel): boolean {
    if (isProduction() && !this.config.enabledInProduction) {
      // In production, only log errors and warnings
      return level === "error" || level === "warn";
    }
    return this.config.enabledLevels.includes(level);
  }

  private formatData(data: any): string {
    if (data === undefined || data === null) {
      return "";
    }

    try {
      if (typeof data === "string") {
        return data;
      }

      if (this.config.formatJson) {
        return JSON.stringify(data, null, 2);
      }

      return JSON.stringify(data);
    } catch (error) {
      return "[Circular or non-serializable data]";
    }
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private getLogPrefix(
    context: string,
    level: LogLevel,
    timestamp?: boolean,
  ): string {
    const useTimestamp = timestamp ?? this.config.showTimestamp;
    const time = useTimestamp ? `[${this.getTimestamp()}]` : "";
    const ctx = `[${context}]`;
    const lvl = `[${level.toUpperCase()}]`;

    return `${time} ${lvl} ${ctx}`.trim();
  }

  private getLogStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: "color: #9CA3AF", // gray
      info: "color: #3B82F6", // blue
      warn: "color: #F59E0B", // amber
      error: "color: #EF4444; font-weight: bold", // red
      success: "color: #10B981", // green
    };
    return styles[level];
  }

  public log(ctx: IShowLog): void {
    const level = ctx.level || "info";

    if (!this.shouldLog(level)) {
      return;
    }

    const prefix = this.getLogPrefix(ctx.context, level, ctx.timestamp);
    const formattedData = this.formatData(ctx.data);
    const message = formattedData ? `${prefix}\n${formattedData}` : prefix;

    switch (level) {
      case "debug":
        console.debug(`%c${message}`, this.getLogStyle(level));
        break;
      case "info":
        console.info(`%c${message}`, this.getLogStyle(level));
        break;
      case "warn":
        console.warn(`%c${message}`, this.getLogStyle(level));
        break;
      case "error":
        console.error(`%c${message}`, this.getLogStyle(level));
        break;
      case "success":
        console.log(`%c${message}`, this.getLogStyle(level));
        break;
    }
  }

  // Convenience methods
  public debug(context: string, data?: any): void {
    this.log({ context, data, level: "debug" });
  }

  public info(context: string, data?: any): void {
    this.log({ context, data, level: "info" });
  }

  public warn(context: string, data?: any): void {
    this.log({ context, data, level: "warn" });
  }

  public error(context: string, data?: any): void {
    this.log({ context, data, level: "error" });
  }

  public success(context: string, data?: any): void {
    this.log({ context, data, level: "success" });
  }

  // Group logging for related logs
  public group(label: string, callback: () => void): void {
    if (!isDevelopment()) return;

    console.group(`%c${label}`, this.getLogStyle("info"));
    callback();
    console.groupEnd();
  }

  public groupCollapsed(label: string, callback: () => void): void {
    if (!isDevelopment()) return;

    console.groupCollapsed(`%c${label}`, this.getLogStyle("info"));
    callback();
    console.groupEnd();
  }

  // Performance timing
  public time(label: string): void {
    if (!isDevelopment()) return;
    console.time(label);
  }

  public timeEnd(label: string): void {
    if (!isDevelopment()) return;
    console.timeEnd(label);
  }

  // Table display for arrays/objects
  public table(data: any): void {
    if (!isDevelopment()) return;
    console.table(data);
  }

  // Configure logger
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new Logger();

// Legacy function for backward compatibility
export const showLog = (ctx: IShowLog) => {
  logger.log(ctx);
};
