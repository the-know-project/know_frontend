"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArtistDetails } from "../api/fetch-user/route";
import { IFetchProfileData } from "../artist/types/profile.types";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { showLog } from "@/src/utils/logger";
import { err, ok, ResultAsync } from "neverthrow";
import { ProfileError } from "../error/profile.error";

type IFetchArtistDetails = Omit<IFetchProfileData, "viewerId">;
export const useFetchArtistDetails = (ctx: IFetchArtistDetails) => {
  const currentUserId = useTokenStore(selectUserId);
  showLog({
    context: "Fetch Artist Details",
    data: {
      viewerId: currentUserId,
    },
  });
  return useQuery({
    queryKey: [`artist-details${ctx.userId}-${currentUserId ?? ""}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchArtistDetails({
          userId: ctx.userId,
          viewerId: currentUserId as string,
        }),
        (error) =>
          new ProfileError(
            `Error fetching artist details: ${error instanceof Error ? error.message : String(error)}`,
          ),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new ProfileError("Error fetching artist details"));
        }
      });
      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    enabled: !!currentUserId,
  });
};
