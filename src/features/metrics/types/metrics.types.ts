import { z } from "zod";
import { IncrementViewCountSchema } from "../schema/metrics.schema";

export type IIncrementViewCount = z.infer<typeof IncrementViewCountSchema>;
