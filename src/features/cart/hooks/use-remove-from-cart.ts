import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { CartError } from "../error/cart.error";
import { removeFromCart } from "../api/remove-from-cart/route";


export type RemoveFromCartResult = {
  mutate: (fileId: string) => void;
  mutateAsync: (fileId: string) => Promise<any | null>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  status: 'idle' | 'pending' | 'success' | 'error';
};

export const useRemoveFromCart = ({ enabled }: { enabled: boolean }): RemoveFromCartResult => {
  const queryClient = useQueryClient();
  const user = useTokenStore((state) => state.user);

  const { mutate, mutateAsync, isPending, isError, error, status } = useMutation({
    mutationFn: async (fileId: string) => {
      if (!enabled || !user?.id) {
        throw new CartError('Cannot remove from cart: Operation not allowed');
      }

      const result = await ResultAsync.fromPromise(
        removeFromCart({
          userId: user.id,
          fileId,
        }),
        (error) => new CartError(`Failed to remove item from cart: ${error}`),
      );

      const finalResult = await result.andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        }
        return err(new CartError(`Failed to remove item: ${data}`));
      });

      if (finalResult.isErr()) {
        throw finalResult.error;
      }

      return finalResult.value;
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ['cart', user.id],
        });
      }
    },
  });

  return {
    mutate,
    mutateAsync: async (fileId: string) => {
      if (!enabled || !user?.id) return null;
      return mutateAsync(fileId);
    },
    isPending,
    isError,
    error,
    status
  };
};
