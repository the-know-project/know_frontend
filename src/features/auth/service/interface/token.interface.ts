import { IUser } from "../../state/interface/auth.interface";

export interface IRefreshTokenRequest {
  refreshToken: string;
  userId: string;
  expiresIn: number;
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
