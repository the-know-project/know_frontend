// src/features/profile/artist/types/post-performance.types.ts
import { z } from "zod";
import { PostPerformanceDto } from "../dto/post-performance.dto";

export type PostPerformance = z.infer<typeof PostPerformanceDto>;

export interface PostPerformanceResponse {
  status: number;
  message: string;
  data: PostPerformance[];
}
