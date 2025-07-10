import { z } from "zod";
import { ArtistMetricsDto } from "../artist/dto/artist.dto";

export type IArtistMetricsDto = z.infer<typeof ArtistMetricsDto>;
