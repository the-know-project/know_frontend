import { z } from "zod";
import { PersonalizeSchema } from "../schema/personalize.schema";

export type IPersonalize = z.infer<typeof PersonalizeSchema>;
