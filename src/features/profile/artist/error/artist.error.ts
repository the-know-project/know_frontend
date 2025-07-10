export class ArtistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtistError";
  }
}
