import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchPostComments } from "../api/fetch-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useFetchPostComments = (postId: string, page: number = 1) => {
  const userId = useTokenStore(selectUserId);

  return useQuery({
    queryKey: [`fetch-post-comments`, postId, page],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchPostComments(postId, page),
        (error) => new ExploreError(`Error fetching comments ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Error fetching comments ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    enabled: !!postId && !!userId,
  });
};
