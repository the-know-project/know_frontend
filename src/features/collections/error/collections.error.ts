export class CollectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CollectionsError";
  }
}
