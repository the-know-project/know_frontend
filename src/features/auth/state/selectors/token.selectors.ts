import { ITokenState } from "../interface/auth.interface";

export const selectUser = (state: ITokenState) => state.user;
export const selectUserId = (state: ITokenState) => state.user?.id;
export const selectAccessToken = (state: ITokenState) => state.accessToken;
export const selectIsAuthenticated = (state: ITokenState) => state.isAuthenticated;
export const selectHasHydrated = (state: ITokenState) => state.hasHydrated