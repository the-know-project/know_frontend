import { z } from "zod";

export const CreateShippingInfoDto = z.object({
  deliveryMethod: z.enum(["delivery", "pickup"]),
  address: z.string().min(1, "Address is required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});
