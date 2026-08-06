import { z } from "zod";

export const CreateShippingInfoDto = z.object({
  address: z.string().min(1, "Address is required"),
  landmark: z.string().min(1, "Landmark is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});
