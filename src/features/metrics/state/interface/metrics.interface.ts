export interface IFollowState {
  userFollowing: string[];

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  followUser: (followingId: string) => void;
  unfollowUser: (followingId: string) => void;
  addFollowings: (followingIds: string[]) => void;

  getUserFollowing: () => string[];
  isUserFollowing: (followingId: string) => boolean;
}
