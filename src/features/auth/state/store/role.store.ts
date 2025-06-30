import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IRoleState } from "../interface/auth.interface";
import { IRole } from "../../types/auth.types";

export const useRoleStore = create<IRoleState>()(
  devtools(
    persist(
      (set) => ({
        role: "NONE",
        hasHydrated: false,
        setRole: (role: IRole) => set({ role }),
        clearRole: () => set({ role: "NONE" }),
      }),
      {
        name: "role-store",
        partialize: (state) => ({ role: state.role }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      },
    ),
  ),
);
