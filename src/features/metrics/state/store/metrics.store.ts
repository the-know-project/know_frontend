import { create } from "zustand";
import { IFollowState } from "../interface/metrics.interface";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useFollowStore = create<IFollowState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        userFollowing: {},
        _hasHydrated: false,
        setHasHydrated: (state) =>
          set(() => ({
            _hasHydrated: state,
          })),

        followUser: (followerId, followingId) =>
          set((state) => {
            if (!state.userFollowing[followerId]) {
              state.userFollowing[followerId] = [];
            }
            if (!state.userFollowing[followerId].includes(followingId)) {
              state.userFollowing[followerId].push(followingId);
            }
          }),
        addFollowings: (followerId, followingIds) =>
          set((state) => {
            if (!state.userFollowing[followerId]) {
              state.userFollowing[followerId] = [];
            }
            const newIds = followingIds.filter(
              (id) => !state.userFollowing[followerId].includes(id),
            );
            if (newIds.length > 0) {
              state.userFollowing[followerId].push(...newIds);
            }
          }),
        unfollowUser: (followerId, followingId) =>
          set((state) => {
            if (state.userFollowing[followerId]) {
              state.userFollowing[followerId] = state.userFollowing[
                followerId
              ].filter((id) => id !== followingId);
            }
          }),
        getUserFollowing: (followerId) => get().userFollowing[followerId] || [],
        isUserFollowing: (followerId, followingId) =>
          get().userFollowing[followerId]?.includes(followingId) || false,
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
        migrate: (persistedState: any, version) => {
          if (
            version === 0 &&
            persistedState &&
            Array.isArray(persistedState.userFollowing)
          ) {
            return {
              ...persistedState,
              userFollowing: {},
            };
          }
          return persistedState;
        },
        version: 1,
      },
    ),
  ),
);

export const useGetUserFollowing = (followerId: string) => {
  const userFollowing = useFollowStore((state) =>
    state.getUserFollowing(followerId),
  );
  return userFollowing;
};

export const useFollowActions = () => {
  const followUser = (followerId: string, followingId: string) => {
    useFollowStore.getState().followUser(followerId, followingId);
  };

  const unfollowUser = (followerId: string, followingId: string) => {
    useFollowStore.getState().unfollowUser(followerId, followingId);
  };

  const useIsUserFollowing = (followerId: string, followingId: string) => {
    const isFollowing = useFollowStore((state) =>
      state.isUserFollowing(followerId, followingId),
    );
    return isFollowing;
  };

  return { followUser, unfollowUser, useIsUserFollowing };
};
