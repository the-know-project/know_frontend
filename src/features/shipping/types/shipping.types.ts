import { z } from "zod";
import {
  CreateShippingInfoDto,
  CreateShippingResponseDto,
} from "../dto/shipping.dto";

export type ICreateShippingInfo = z.infer<typeof CreateShippingInfoDto>;
export type ICreateShippingResponse = z.infer<typeof CreateShippingResponseDto>;
