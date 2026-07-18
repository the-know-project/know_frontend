import { ApiClient } from "@/src/lib/api-client";
import { AUTH_OP } from "../../data/auth.path";
import { IRole } from "../../types/auth.types";

export function googleLogin(role: IRole) {
  const path = `${AUTH_OP.GOOGLE_LOGIN}?role=${role}`;
  return ApiClient.window(path);
}
