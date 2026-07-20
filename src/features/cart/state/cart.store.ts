import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IAddToLocalCart } from "../types/cart.types";

export interface ICartItems {
  fileId: string;
  quantity: number;

  price: number;

  url: string;
}

interface CartState {
  cart: Record<string, ICartItems>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  addToCart: (ctx: IAddToLocalCart) => void;
  removeFromCart: (fileId: string) => void;
  isItemInCart: (fileId: string) => boolean;
  getItemProps: (fileId: string) => ICartItems;
  initializeCart: (items: ICartItems[]) => void;
  clearCartItems: () => void;

  getCartItems: () => ICartItems[];
  incrementItemQuantity: (fileId: string) => void;
  decrementItemQuantity: (fileId: string) => void;

  getItemsFileIds: () => string[];
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        cart: {},
        _hasHydrated: false,
        setHasHydrated: (state) =>
          set(() => ({
            _hasHydrated: state,
          })),

        addToCart: (ctx: IAddToLocalCart) =>
          set((state) => {
            state.cart[ctx.fileId] = {
              fileId: ctx.fileId,
              quantity: ctx.quantity,
              price: ctx.price,
              url: ctx.url,
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

        getItemProps: (fileId) => {
          const state = get();
          return {
            fileId: fileId,
            quantity: state.cart[fileId]?.quantity || 0,
            price: state.cart[fileId]?.price || 0,
            url: state.cart[fileId]?.url || "",
          };
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
                price: item.price,
                url: item.url,
              };
            });
          }),

        clearCartItems: () =>
          set((state) => {
            state.cart = {};
          }),

        getCartItems: () => {
          const state = get();
          return Object.values(state.cart);
        },

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
            if (typeof window === "undefined") return null;
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          },
          setItem: (name, value) => {
            if (typeof window === "undefined") return;
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            if (typeof window === "undefined") return;
            localStorage.removeItem(name);
          },
        },
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  ),
);

export const useGetItemsFileIds = () =>
  useCartStore((state) => state.getItemsFileIds());

export const useIsItemInCart = (fileId: string) =>
  useCartStore((state) => state.isItemInCart(fileId));

export const useGetTotalItemsCount = () =>
  useCartStore((state) => state.getTotalItemsCount());

export const useCartHydration = () =>
  useCartStore((state) => state._hasHydrated);

export const useCartActions = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCartItems = useCartStore((state) => state.clearCartItems);
  const getCartItems = useCartStore((state) => state.getCartItems);
  const initializeCart = useCartStore((state) => state.initializeCart);

  const getItemProps = useCartStore((state) => state.getItemProps);

  const incrementQuantity = useCartStore(
    (state) => state.incrementItemQuantity,
  );
  const decrementQuantity = useCartStore(
    (state) => state.decrementItemQuantity,
  );

  return {
    addToCart,
    getCartItems,
    removeFromCart,
    clearCartItems,
    initializeCart,
    incrementQuantity,
    decrementQuantity,
    getItemProps,
  };
};
