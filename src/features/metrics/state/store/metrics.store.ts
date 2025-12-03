import { create } from "zustand";
import { IFollowState } from "../interface/metrics.interface";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useFollowStore = create<IFollowState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        userFollowing: [],
        _hasHydrated: false,
        setHasHydrated: (state) =>
          set(() => ({
            _hasHydrated: state,
          })),

        followUser: (userId) =>
          set((state) => {
            if (!state.userFollowing.includes(userId)) {
              state.userFollowing.push(userId);
            }
          }),
        addFollowings: (userIds) =>
          set((state) => {
            const newIds = userIds.filter(
              (id) => !state.userFollowing.includes(id),
            );
            if (newIds.length > 0) {
              state.userFollowing.push(...newIds);
            }
          }),
        unfollowUser: (userId) =>
          set((state) => ({
            userFollowing: state.userFollowing.filter((id) => id !== userId),
          })),
        getUserFollowing: () => get().userFollowing,
        isUserFollowing: (userId) => get().userFollowing.includes(userId),
      })),
      {
        name: "follow-store",
        storage: {
          getItem: async (key) => {
            if (typeof window === "undefined") return null;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          },
          setItem: async (key, value) => {
            if (typeof window === "undefined") return null;
            localStorage.setItem(key, JSON.stringify(value));
          },
          removeItem: async (key) => {
            if (typeof window === "undefined") return null;
            localStorage.removeItem(key);
          },
        },
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  ),
);

export const useGetUserFollowing = () => {
  const userFollowing = useFollowStore((state) => state.userFollowing);
  return userFollowing;
};

export const useFollowActions = () => {
  const useFollow = (userId: string) => {
    const followUser = useFollowStore((state) => state.followUser);
    return followUser(userId);
  };

  const useUnfollow = (userId: string) => {
    const unfollowUser = useFollowStore((state) => state.unfollowUser);
    return unfollowUser(userId);
  };

  const useIsUserFollowing = (userId: string) => {
    const isFollowing = useFollowStore((state) =>
      state.isUserFollowing(userId),
    );
    return isFollowing;
  };

  return { useFollow, useUnfollow, useIsUserFollowing };
};
