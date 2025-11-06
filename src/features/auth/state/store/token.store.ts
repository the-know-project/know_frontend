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
        refreshAccessToken: (accessToken: string) => {
          const currentState = get();
          set({
            accessToken,
            isAuthenticated: true,
            user: currentState.user,
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
        version: 3, // ← Increment version
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken, // ← ADD THIS!
        }),
        migrate: (persistedState: any, version: number) => {
          if (version < 3) {
            return {
              user: persistedState?.user || null,
              isAuthenticated: persistedState?.isAuthenticated || false,
              accessToken: persistedState?.accessToken || null, // ← ADD THIS
              hasHydrated: false,
            };
          }
          return persistedState;
        },
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
            // ← REMOVE THE LINE: state.accessToken = null;
          }
        },
      },
    ),
  ),
);
