import { z } from "zod";
import { FetchArtistDto } from "../dto/artist.dto";
export type IFetchProfileData = z.infer<typeof FetchArtistDto>;
