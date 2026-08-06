import { z } from "zod";
import { CreateShippingInfoDto } from "../dto/shipping.dto";

export type ICreateShippingInfo = z.infer<typeof CreateShippingInfoDto>;
