import axios from "axios";
import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { createUrl } from "@/src/utils/url-factory";
import { MAIL_LIST_OP } from "../data/data";
import { IAddToMailList } from "../schemas/email.schema";

function provideUrl() {
  const config = env.env;
  const baseUrl = isProduction() ? config.PROD_URL : config.STAGING_URL;
  return createUrl({
    baseUrl,
    path: MAIL_LIST_OP.ADD_TO_MAIL_LIST,
  });
}

export async function addToMailList(ctx: IAddToMailList) {
  const response = await axios.post(provideUrl(), ctx);
  return response.data;
}
