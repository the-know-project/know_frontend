import { IRoleState } from "../interface/auth.interface";

export const selectRole = (state: IRoleState) => state.role
export const selectHasHydrated = (state: IRoleState) => state.hasHydrated;