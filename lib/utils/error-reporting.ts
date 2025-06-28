interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private reports: ErrorReport[] = [];

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  report(error: Error, context?: Record<string, any>, userId?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      userId,
      context,
    };

    this.reports.push(report);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      this.sendToErrorService(report);
    } else {
      console.error("Error Report:", report);
    }
  }

  private async sendToErrorService(report: ErrorReport) {
    try {
      // Replace with your error tracking service endpoint
      await fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch (err) {
      console.error("Failed to send error report:", err);
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }
}
