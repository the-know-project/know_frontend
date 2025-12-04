export interface IFollowState {
  userFollowing: Record<string, string[]>;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  followUser: (followerId: string, followingId: string) => void;
  unfollowUser: (followerId: string, followingId: string) => void;
  addFollowings: (followerId: string, followingIds: string[]) => void;

  getUserFollowing: (followerId: string) => string[];
  isUserFollowing: (followerId: string, followingId: string) => boolean;
}
