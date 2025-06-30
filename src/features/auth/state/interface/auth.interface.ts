import { IRole } from "../../types/auth.types";

export interface IRoleState {
  role: IRole;
  hasHydrated: boolean;
  setRole: (role: IRole) => void;
  clearRole: () => void;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  imageUrl: string;
  role?: string;
}

export interface ITokenState {
  accessToken: string | null;
  refreshToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setTokens: (accessToken: string, refreshToken: string, user: IUser) => void;
  updateAccessToken: (accessToken: string) => void;
  clearTokens: () => void;

  isTokenExpired: () => boolean;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}
