import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { CartError } from "../error/cart.error";
import { removeFromCart } from "../api/remove-from-cart/route";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { IUserCart, TCart } from "../types/cart.types";
import { useCartActions } from "../state/cart.store";

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
  const user = useTokenStore(selectUser);
  const { addToCart: addToLocalCart, removeFromCart: removeFromLocalCart } = useCartActions();

  const { mutate, mutateAsync, isPending, isError, error, status } = useMutation({
    mutationKey: ['remove-from-cart', user?.id],
    
    mutationFn: async (fileId: string) => {
      if (!enabled || !user?.id) {
        throw new CartError('Cannot remove from cart: Operation not allowed');
      }

      console.log('🗑️ Removing from cart:', { userId: user.id, fileId });

      const result = await ResultAsync.fromPromise(
        removeFromCart({
          userId: user.id,
          fileId,
        }),
        (error) => new CartError(`Failed to remove item from cart: ${error}`)
      );

      const finalResult = await result.andThen((data) => {
        console.log('✅ Backend response:', data);
        if (data.status === 200 || data.status === 204) {
          return ok(data);
        }
        return err(new CartError(`Failed to remove item: ${JSON.stringify(data)}`));
      });

      if (finalResult.isErr()) {
        throw finalResult.error;
      }

      console.log(' Item removed from cart:', finalResult.value);
      return finalResult.value;
    },

    // Optimistic update - updates BOTH Zustand store and React Query cache
    onMutate: async (fileId: string) => {
      if (!user?.id) return;

      console.log('⚡ Optimistic update: Removing item', fileId);

      // 1. Update local Zustand store immediately
      removeFromLocalCart(fileId);

      // 2. Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['fetch-user-cart', user.id],
      });

      // 3. Snapshot the previous value
      const previousCart = queryClient.getQueryData<IUserCart>([
        'fetch-user-cart',
        user.id,
      ]);

      // 4. Optimistically update React Query cache
      if (previousCart) {
        queryClient.setQueryData<IUserCart>(
          ['fetch-user-cart', user.id],
          (old) => {
            if (!old) return old;

            return {
              ...old,
              data: {
                items: old.data.items.filter((item: TCart) => item.fileId !== fileId),
                totalItems: Math.max(0, old.data.totalItems - 1),
              },
            };
          }
        );
      }

      // Return context with the previous value for rollback
      return { previousCart };
    },

    // On error, rollback BOTH stores
    onError: (error, fileId, context) => {
      console.error(' Failed to remove from cart:', error);

      // 1. Rollback Zustand store
      addToLocalCart(fileId);

      // 2. Rollback React Query cache
      if (context?.previousCart && user?.id) {
        console.log(' Rolling back optimistic update');
        queryClient.setQueryData(
          ['fetch-user-cart', user.id],
          context.previousCart
        );
      }
    },

    // On success, ensure stores are synced
    onSuccess: (data, fileId) => {
      console.log(' Successfully removed from cart');
      
      if (user?.id) {
        // Ensure local store is synced
        removeFromLocalCart(fileId);

        // Invalidate queries to sync with server
        queryClient.invalidateQueries({
          queryKey: ['fetch-user-cart', user.id],
        });
        
        // Also invalidate the old query key if you were using it
        queryClient.invalidateQueries({
          queryKey: ['cart', user.id],
        });
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      if (user?.id) {
        console.log(' Invalidating cart queries');
        queryClient.invalidateQueries({
          queryKey: ['fetch-user-cart', user.id],
        });
      }
    },
  });

  return {
    mutate,
    mutateAsync: async (fileId: string) => {
      if (!enabled || !user?.id) {
        console.warn(' Cannot remove from cart: Not enabled or user not authenticated');
        return null;
      }
      return mutateAsync(fileId);
    },
    isPending,
    isError,
    error,
    status,
  };
};