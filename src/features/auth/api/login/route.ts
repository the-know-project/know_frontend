import { showLog } from "@/src/utils/logger";
import { AUTH_OP } from "../../data/auth.path";
import { ILogin } from "../../types/auth.types";
import { ApiClient } from "@/src/lib/api-client";

export async function login(ctx: ILogin) {
  showLog({
    context: "Log in",
    data: ctx,
  });
  return await ApiClient.post(AUTH_OP.LOGIN, ctx);
}
