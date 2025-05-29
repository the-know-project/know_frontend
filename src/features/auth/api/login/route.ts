import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { createUrl } from "@/src/utils/url-factory";
import axios from "axios";
import { AUTH_OP } from "../../data/auth.path";
import { ILogin } from "../../types/auth.types";

function provideUrl() {
  const config = env.env;
  const baseUrl = isProduction() ? config.PROD_URL : config.STAGING_URL;
  return createUrl({
    baseUrl,
    path: AUTH_OP.LOGIN,
  });
}

export async function login(ctx: ILogin) {
  const response = await axios.post(provideUrl(), ctx);
  return response.data;
}
