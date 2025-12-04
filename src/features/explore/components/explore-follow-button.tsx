"use client";

import { Button } from "@/src/shared/ui/button";
import { PlusCircle } from "lucide-react";
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
  const { mutateAsync: followUser, isPending } = useFollowUser();
  const { mutateAsync: unFollowUser, isPending: isUnfollowing } =
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

  return (
    <Button
      onClick={handleFollowUser}
      className="font-bebas w-full cursor-pointer bg-[#1E3A8A] p-6 tracking-wider hover:bg-[#2c52ba]"
    >
      <PlusCircle /> {isFollowing === true ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default ExploreFollowButton;
