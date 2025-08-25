import { AUTH_OP } from "../../data/auth.path";
import { ILogin } from "../../types/auth.types";
import { ApiClient } from "@/src/lib/api-client";

export async function login(ctx: ILogin) {
  return await ApiClient.post(AUTH_OP.LOGIN, ctx);
}
