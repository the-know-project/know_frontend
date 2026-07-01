export class PersonalizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersonalizeError";
  }
}
