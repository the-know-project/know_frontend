"use client";

import { Button } from "@/src/shared/ui/button";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";
import { useFollowUser } from "../../metrics/hooks/use-follow-user";
import { useUnfollowUser } from "../../metrics/hooks/use-unfollow-user";
import { useFollowActions } from "../../metrics/state/store/metrics.store";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

interface ExploreFollowButtonProps {
  artistId: string;
}

const ExploreFollowButton = ({ artistId }: ExploreFollowButtonProps) => {
  const followerId = useTokenStore(selectUserId);
  const { mutateAsync: followUser, isPending: isFollowingUser } =
    useFollowUser();
  const { mutateAsync: unFollowUser, isPending: isUnfollowingUser } =
    useUnfollowUser();
  const { useIsUserFollowing } = useFollowActions();

  const isFollowing = useIsUserFollowing(followerId || "", artistId);

  const handleFollowUser = async () => {
    if (isFollowing) {
      await unFollowUser({
        followingId: artistId,
      });
    } else {
      await followUser({
        followingId: artistId,
      });
    }
  };

  const isPending = isFollowingUser || isUnfollowingUser;

  return (
    <Button
      type="button"
      onClick={handleFollowUser}
      disabled={isPending}
      className="font-bebas min-h-11 w-full cursor-pointer rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm tracking-wider text-white shadow-sm hover:bg-indigo-800"
    >
      {isFollowing === true ? (
        <UserRoundCheck className="h-4 w-4" />
      ) : (
        <UserRoundPlus className="h-4 w-4" />
      )}
      {isFollowingUser
        ? "Following…"
        : isUnfollowingUser
          ? "Unfollowing…"
          : isFollowing === true
            ? "Unfollow artist"
            : "Follow artist"}
    </Button>
  );
};

export default ExploreFollowButton;
