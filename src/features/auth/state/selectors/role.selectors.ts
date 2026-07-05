import { IRole } from "../../types/auth.types";
import { IRoleState } from "../interface/auth.interface";

export const selectRole = (state: IRoleState) => state.role;

export const setRole = (state: IRoleState) => state.setRole;
export const selectHasHydrated = (state: IRoleState) => state.hasHydrated;
