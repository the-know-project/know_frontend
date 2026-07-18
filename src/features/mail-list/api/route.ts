import { ApiClient } from "@/src/lib/api-client";
import { MAIL_LIST_OP } from "../data/data";
import { IAddToMailList } from "../schemas/email.schema";

export async function addToMailList(ctx: IAddToMailList) {
  return ApiClient.post(MAIL_LIST_OP.ADD_TO_MAIL_LIST, ctx);
}
