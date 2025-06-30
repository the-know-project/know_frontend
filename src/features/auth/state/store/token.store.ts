import { create } from "zustand";
import { ITokenState, IUser } from "../interface/auth.interface";
import { devtools, persist } from "zustand/middleware";

const isJwtExpired = (token: string | null) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;

    //eslint-disable-next-line
  } catch (error) {
    return true;
  }
};

export const useTokenStore = create<ITokenState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        hasHydrated: false,

        setTokens: (accessToken: string, refreshToken: string, user: IUser) => {
          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        },

        updateAccessToken: (accessToken: string) => {
          set({ accessToken });
        },

        clearTokens: () => {
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          });
        },

        isTokenExpired: () => {
          const { accessToken } = get();
          return isJwtExpired(accessToken);
        },

        getAccessToken: () => {
          const { accessToken } = get();
          return accessToken;
        },

        getRefreshToken: () => {
          const { refreshToken } = get();
          return refreshToken;
        },

        getUser: () => {
          const { user } = get();
          return user;
        },
      }),
      {
        name: "token-store",
        version: 1,
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        migrate: (persistedState: any, version: number) => {
          // Handle migration if token structure changes in the future
          if (version === 0) {
            // Clear old token format if any
            return {
              accessToken: null,
              refreshToken: null,
              user: null,
              isAuthenticated: false,
              hasHydrated: false,
            };
          }
          return persistedState;
        },
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      },
    ),
  ),
);
