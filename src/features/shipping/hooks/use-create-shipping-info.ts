import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import {
  ICreateShippingInfo,
  ICreateShippingResponse,
} from "../types/shipping.types";
import { createShippingInfo } from "../api/create-shipping-info/route";

export const useCreateShippingInfo = () => {
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`create-shipping-info-${userId}`],
    mutationFn: async (ctx: ICreateShippingInfo) => {
      const result = await ResultAsync.fromPromise(
        createShippingInfo(ctx),
        (error) => new Error(`Error updating shipping information ${error}`),
      ).andThen((data) => {
        if (data.status === 201) {
          return ok(data);
        }

        return err(new Error(`${data.message}`));
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as ICreateShippingResponse;
    },
  });
};
