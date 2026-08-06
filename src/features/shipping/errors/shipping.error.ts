export class ShippingError extends Error {
  constructor(message: string = "Failed to fetch shipping information") {
    super(message);
    this.name = "ShippingError";
  }
}
