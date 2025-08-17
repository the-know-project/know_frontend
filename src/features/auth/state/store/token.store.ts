import { create } from "zustand";
import { ITokenState, IUser } from "../interface/auth.interface";
import { devtools, persist } from "zustand/middleware";

export const useTokenStore = create<ITokenState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        hasHydrated: false,

        setAccessToken: (accessToken: string, user: IUser) => {
          set({
            accessToken,
            user,
            isAuthenticated: true,
          });
        },

        updateAccessToken: (accessToken: string) => {
          set({ accessToken });
        },

        clearAuth: () => {
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
          });
        },

        getAccessToken: () => {
          const { accessToken } = get();
          return accessToken;
        },

        getUser: () => {
          const { user } = get();
          return user;
        },

        setHydrated: (hydrated: boolean) => {
          set({ hasHydrated: hydrated });
        },
      }),
      {
        name: "auth-store",
        version: 2,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        migrate: (persistedState: any, version: number) => {
          // Handle migration from old token structure
          if (version < 2) {
            return {
              user: persistedState?.user || null,
              isAuthenticated: persistedState?.isAuthenticated || false,
              hasHydrated: false,
            };
          }
          return persistedState;
        },
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
            state.accessToken = null;
          }
        },
      },
    ),
  ),
);
