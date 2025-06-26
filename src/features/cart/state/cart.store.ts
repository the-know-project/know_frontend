import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ICartItems {
  fileId: string;
  quantity: number;
}

interface CartState {
  cart: Record<string, ICartItems>;

  addToCart: (fileId: string) => void;
  removeFromCart: (fileId: string) => void;
  isItemInCart: (fileId: string) => boolean;
  getItemQuantity: (fileId: string) => number;
  initializeCart: (items: ICartItems[]) => void;
  clearCartItems: () => void;
  incrementItemQuantity: (fileId: string) => void;
  decrementItemQuantity: (fileId: string) => void;

  getItemsFileIds: () => string[];
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      cart: {},

      addToCart: (fileId) =>
        set((state) => {
          state.cart[fileId] = {
            fileId: fileId,
            quantity: 1,
          };
        }),

      removeFromCart: (fileId) =>
        set((state) => {
          if (state.cart[fileId]) {
            delete state.cart[fileId];
          }
        }),

      isItemInCart: (fileId) => {
        const state = get();
        return fileId in state.cart;
      },

      getItemQuantity: (fileId) => {
        const state = get();
        return state.cart[fileId]?.quantity || 0;
      },

      incrementItemQuantity: (fileId) =>
        set((state) => {
          if (state.cart[fileId]) {
            state.cart[fileId].quantity += 1;
          }
        }),

      decrementItemQuantity: (fileId) =>
        set((state) => {
          if (state.cart[fileId]) {
            state.cart[fileId].quantity -= 1;
            if (state.cart[fileId].quantity <= 0) {
              delete state.cart[fileId];
            }
          }
        }),

      initializeCart: (ctx) =>
        set((state) => {
          state.cart = {};
          ctx.forEach((item) => {
            state.cart[item.fileId] = {
              fileId: item.fileId,
              quantity: item.quantity,
            };
          });
        }),

      clearCartItems: () =>
        set((state) => {
          state.cart = {};
        }),

      getItemsFileIds: () => {
        const state = get();
        return Object.keys(state.cart);
      },

      getTotalItemsCount: () => {
        const state = get();
        return Object.values(state.cart).reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
      },
    })),

    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export const useGetItemsFileIds = () =>
  useCartStore((state) => state.getItemsFileIds());

export const useIsItemInCart = (fileId: string) =>
  useCartStore((state) => state.isItemInCart(fileId));

export const useGetTotalItemsCount = () =>
  useCartStore((state) => state.getTotalItemsCount());

export const useCartActions = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCartItems = useCartStore((state) => state.clearCartItems);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const incrementQuantity = useCartStore(
    (state) => state.incrementItemQuantity,
  );
  const decrementQuantity = useCartStore(
    (state) => state.decrementItemQuantity,
  );

  return {
    addToCart,
    removeFromCart,
    clearCartItems,
    initializeCart,
    incrementQuantity,
    decrementQuantity,
  };
};
