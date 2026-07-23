"use client";

import { useQuery } from "@tanstack/react-query";

import { IFetchProfileData } from "../artist/types/profile.types";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { err, ok, ResultAsync } from "neverthrow";
import { ProfileError } from "../error/profile.error";
import { fetchProfile } from "../api/fetch-user/route";

type IFetchProfileDetails = Omit<IFetchProfileData, "viewerId">;
export const useFetchProfileDetails = (ctx: IFetchProfileDetails) => {
  const currentUserId = useTokenStore(selectUserId);

  return useQuery({
    queryKey: [`user-profile-${ctx.userId}-${currentUserId ?? ""}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchProfile({
          userId: ctx.userId,
          viewerId: currentUserId as string,
        }),
        (error) =>
          new ProfileError(
            `Error fetching user details: ${error instanceof Error ? error.message : String(error)}`,
          ),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new ProfileError("Error fetching user details"));
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
