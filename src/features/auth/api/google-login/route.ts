import { AUTH_OP } from "../../data/auth.path";
import { IRole } from "../../types/auth.types";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export function googleLogin(role: IRole) {
  const path = `${AUTH_OP.GOOGLE_LOGIN}?role=${role}`;
  return AuthenticatedApiClient.window(path);
}
