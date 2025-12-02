import { ExploreErrorMessages } from "../data/explore.data";

export class ExploreError extends Error {
  constructor(message: string = ExploreErrorMessages.FAILED_TO_FETCH_ASSET) {
    super(message);
    this.name = "ExploreError";
  }
}

export class CommentError extends ExploreError {
  constructor(message: string = ExploreErrorMessages.FAILED_TO_FETCH_COMMENTS) {
    super(message);
    this.name = "CommentError";
  }
}