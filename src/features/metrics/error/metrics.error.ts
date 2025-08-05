export class MetricsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetricsError";
  }
}
