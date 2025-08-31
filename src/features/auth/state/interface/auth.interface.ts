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

  user: IUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setAccessToken: (accessToken: string, user: IUser) => void;
  refreshAccessToken: (accessToken: string) => void;
  updateAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  getUser: () => IUser | null;
  setHydrated: (hydrated: boolean) => void;
}
