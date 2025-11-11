import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { addToCart } from "../api/add-to-cart/route";
import { CartError } from "../error/cart.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { IUserCart, ICartItem } from "../types/cart.types";
import { useCartActions } from "../state/cart.store"; // Import cart store actions

export const useAddToCart = ({ enabled }: { enabled: boolean }) => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { addToCart: addToLocalCart, removeFromCart: removeFromLocalCart } = useCartActions();

  return useMutation({
    mutationKey: ['add-to-cart', userId],
    mutationFn: async (fileId: string) => {
      if (!enabled || !userId) {
        throw new CartError('Cannot add to cart: User not authenticated');
      }

      console.log('🛒 Adding to cart:', { userId, fileId });

      const result = await ResultAsync.fromPromise(
        addToCart({
          userId,
          fileId,
        }),
        (error) => new CartError(`Error adding item to cart: ${error}`)
      ).andThen((data) => {
        console.log(' Backend response:', data);
        if (data.status === 200 || data.status === 201) {
          return ok(data);
        } else {
          return err(
            new CartError(`An error occurred while calling function: ${JSON.stringify(data)}`)
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      console.log(' Item added to cart:', result.value);
      return result.value;
    },

    // Optimistic update - updates BOTH React Query cache AND Zustand store
    onMutate: async (fileId: string) => {
      console.log('⚡ Optimistic update: Adding item', fileId);

      // 1. Update local Zustand store immediately
      addToLocalCart(fileId);

      // 2. Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['fetch-user-cart', userId],
      });

      // 3. Snapshot the previous React Query cache value
      const previousCart = queryClient.getQueryData<IUserCart>([
        'fetch-user-cart',
        userId,
      ]);

      // 4. Optimistically update React Query cache
      if (previousCart) {
        queryClient.setQueryData<IUserCart>(
          ['fetch-user-cart', userId],
          (old) => {
            if (!old) return old;

            const newItem: ICartItem = {
              fileId,
              userId: userId!,
              addedAt: new Date().toISOString(),
              // Add other required fields from your ICartItem interface
            };

            return {
              ...old,
              data: {
                items: [...old.data.items, newItem],
                totalItems: old.data.totalItems + 1,
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
      console.error(' Failed to add to cart:', error);
      
      // 1. Rollback Zustand store
      removeFromLocalCart(fileId);

      // 2. Rollback React Query cache
      if (context?.previousCart) {
        console.log('↩️ Rolling back optimistic update');
        queryClient.setQueryData(
          ['fetch-user-cart', userId],
          context.previousCart
        );
      }
    },

    // On success, ensure local store is synced
    onSuccess: (data, fileId) => {
      console.log(' Successfully added to cart, syncing stores');
      // Local store should already have the item from onMutate
      // But we can ensure it's there
      addToLocalCart(fileId);
    },

    // Always refetch after error or success to sync with server
    onSettled: () => {
      console.log(' Invalidating cart queries');
      queryClient.invalidateQueries({
        queryKey: ['fetch-user-cart', userId],
      });
    },
  });
};