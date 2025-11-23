import { z } from "zod";
import {
  PostPerformanceItemDto,
  PostPerformanceMetaDto,
} from "../dto/post-performance.dto";

export type PostPerformance = z.infer<typeof PostPerformanceItemDto>;
export type PostPerformanceMeta = z.infer<typeof PostPerformanceMetaDto>;