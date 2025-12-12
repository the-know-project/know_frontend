import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchPostComments } from "../api/fetch-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { useCommentActions } from "../state/explore-comment.store";
import { IFetchPostComments, TComments } from "../types/explore-comment.types";

export const useFetchPostComments = (params: IFetchPostComments) => {
  const { fileId, page, limit } = params;
  const userId = useTokenStore(selectUserId);
  const { setComments, appendComments, setLoading } = useCommentActions();

  return useQuery({
    queryKey: [`fetch-post-comments`, fileId, page],
    queryFn: async () => {
      setLoading(fileId, true);

      const result = await ResultAsync.fromPromise(
        fetchPostComments(params),
        (error) => new ExploreError(`Error fetching comments: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Error fetching comments. Status: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        setLoading(fileId, false);
        throw result.error;
      }

      if (page === 1) {
        setComments(fileId, result.value.data);
      } else {
        appendComments(fileId, result.value.data);
      }

      setLoading(fileId, false);
      return result.value as TComments;
    },
    enabled: !!fileId && !!userId,
    staleTime: 30_000, // 30 seconds
    retry: 2,
  });
};
