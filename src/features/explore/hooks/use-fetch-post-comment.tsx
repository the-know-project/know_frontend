import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchPostComments } from "../api/fetch-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { useCommentActions } from "../state/explore-comment.store";

export const useFetchPostComments = (postId: string, page: number = 1) => {
  const userId = useTokenStore(selectUserId);
  const { setComments, appendComments, setLoading } = useCommentActions();

  return useQuery({
    queryKey: [`fetch-post-comments`, postId, page],
    queryFn: async () => {
      setLoading(postId, true);

      const result = await ResultAsync.fromPromise(
        fetchPostComments(postId, page),
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
        setLoading(postId, false);
        throw result.error;
      }

      // Update Zustand store
      if (page === 1) {
        setComments(postId, result.value.data);
      } else {
        appendComments(postId, result.value.data);
      }

      setLoading(postId, false);
      return result.value;
    },
    enabled: !!postId && !!userId,
    staleTime: 30_000, // 30 seconds
    retry: 2,
  });
};
