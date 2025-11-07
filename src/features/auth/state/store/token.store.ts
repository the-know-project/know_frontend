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
        version: 3, // ← INCREMENT VERSION
        
        // FIX: Persist the accessToken too!
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken, // ← ADD THIS LINE
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
        
        // FIX: Don't clear the token on rehydration!
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
            // ← REMOVED: state.accessToken = null;
            
            // Optional: Validate token still exists with user
            if (state.user && !state.accessToken) {
              // User exists but no token - clear everything
              state.isAuthenticated = false;
              state.user = null;
            }
          }
        },
      },
    ),
  ),
);
