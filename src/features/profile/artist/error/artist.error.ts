export class ArtistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtistError";
  }
}
export class PostPerformanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostPerformanceError";
  }
}

export class PostPerformanceUnauthorizedError extends Error {
  constructor(message: string = "Unauthorized to access post performance") {
    super(message);
    this.name = "PostPerformanceUnauthorizedError";
  }
}

export class PostPerformanceNotFoundError extends Error {
  constructor(message: string = "Post performance data not found") {
    super(message);
    this.name = "PostPerformanceNotFoundError";
  }
}