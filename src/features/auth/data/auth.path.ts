export enum AUTH_OP {
  SEND_OTP = "/api/auth/send-otp-to-email",
  VALIDATE_OTP = "/api/auth/validate-otp",
  LOGIN = "/api/auth/login",
  LOGOUT = "/api/auth/logout",
  SIGN_UP = "/api/auth/registerUser",
  GOOGLE_LOGIN = "/api/auth/google-login",
  DISCORD_LOGIN = "/api/auth/discord-login",
  FORGOT_PASSWORD = "/api/auth/send-otp-to-existing-email",
  CREATE_NEW_PASSWORD = "/api/auth/create-new-password",
  REFRESH_TOKEN = "/api/auth/refreshToken",
}

export const SKIP_AUTH = [
  "/api/auth/login",
  "/api/auth/registerUser",
  "/api/auth/refreshToken",
  "/api/mail-list/addToMailList",
  "/api/categories/getCategories",
  "/api/auth/send-otp-to-existing-email",
  "/api/auth/create-new-password",
];
