import { IUser } from "../../state/interface/auth.interface";

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: number;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  payload?: any;
}
