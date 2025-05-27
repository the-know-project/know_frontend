import { z } from "zod";
import { EnvConfig } from "../config";

const EnvSchema = z.object({
  env: z.object({
    PROD_URL: z.string().min(5),
    STAGING_URL: z.string().min(5),
  }),
});

export const env = EnvSchema.parse(EnvConfig);
