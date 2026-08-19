"use client";
import Image from "next/image";
import { Button } from "@/src/shared/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFetchUserCart } from "@/src/features/cart/hooks/use-fetch-user-cart";
import { useUpdateQuantity } from "@/src/features/cart/hooks/use-update-quantity";
import { useCartActions } from "@/src/features/cart/state/cart.store";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import Link from "next/link";
import { useCreateOrder } from "@/src/features/orders/hooks/use-create-order";
import { IOrderItems } from "@/src/features/orders/types/orders.types";

export function OrderConfirmation() {
  const router = useRouter();
  const { data: cartOrdersData, isLoading: cartLoading } = useFetchUserCart();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutate: updateQuantity } = useUpdateQuantity({
    enabled: true,
  });
  const { getItemProps } = useCartActions();
  const quantityUpdateTimeouts = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  );

  const handleQuantityUpdate = (ctx: {
    fileId: string;
    opts: "add" | "remove";
  }) => {
    if (ctx.opts === "remove" && getItemProps(ctx.fileId).quantity <= 1) {
      return;
    }

    const existingTimeout = quantityUpdateTimeouts.current.get(ctx.fileId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      quantityUpdateTimeouts.current.delete(ctx.fileId);
      updateQuantity(ctx);
    }, 50);

    quantityUpdateTimeouts.current.set(ctx.fileId, timeout);
  };

  useEffect(() => {
    return () => {
      quantityUpdateTimeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      quantityUpdateTimeouts.current.clear();
    };
  }, []);

  const handleSubmit = async () => {
    await handleCreateOrder();
  };

  if (cartLoading) {
    return <LoadingGrid />;
  }

  const cartItems = cartOrdersData?.data || [];
  const cartMeta = cartOrdersData?.meta || {
    subTotal: "#0.00",
    totalQuantity: 0,
    fixedShippingFee: "#0.00",
    total: "#0.00",
  };

  const handleCreateOrder = async () => {
    const orderToastId = toast.loading(`Placing your order`, {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });

    let payload: IOrderItems = [];

    cartItems.map((item) => {
      payload.push({
        fileId: item.id,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        userId: item.artistId,
      });
    });

    const data = await createOrder({
      items: payload,
    });

    if (data.status === 200) {
      toast("Order created", {
        id: orderToastId,
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: " oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });

      router.push("/checkout/success");
    } else {
      toast("An error occurred", {
        id: orderToastId,
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    }
  };

  if (cartItems.length === 0) {
    return <EmptyState message="Your cart is empty" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-0 sm:py-8">
      {/* Heading */}
      <div>
        <h2 className="font-helvetica text-base font-semibold text-neutral-900 capitalize sm:text-lg">
          Order Details
        </h2>
        <p className="font-grotesk text-xs text-neutral-600 sm:text-sm">
          Review and confirm your order details.
        </p>
      </div>

      {/* Items */}
      <div className="space-y-4 sm:space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4">
            <Image
              src={item.url}
              alt={item.title}
              width={80}
              height={80}
              className="h-20 w-20 flex-shrink-0 rounded-md object-cover sm:h-24 sm:w-24"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <h4 className="font-grotesk text-xs text-neutral-600 capitalize sm:text-sm">
                  {item.artistFirstName} {item.artistLastName}{" "}
                </h4>
                <p className="font-helvetica text-lg font-bold text-neutral-800 capitalize">
                  {item.title}
                </p>
                <p className="font-grotesk motion-preset-expand motion-duration-700 text-sm font-semibold tracking-wide text-neutral-800">
                  {item.price}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-md border px-2 sm:h-9 sm:gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuantityUpdate({ fileId: item.fileId, opts: "remove" })
                }
                className="p-0.5"
              >
                <Minus className="h-3 w-3 text-neutral-500 sm:h-4 sm:w-4" />
              </button>
              <span className="font-bebas w-4 text-center text-xs tracking-wider sm:text-sm">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleQuantityUpdate({ fileId: item.fileId, opts: "add" })
                }
                className="p-0.5"
              >
                <Plus className="h-3 w-3 text-neutral-500 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="font-grotesk space-y-2 border-t pt-4 text-xs text-neutral-600 sm:pt-6 sm:text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-neutral-800">
            {cartMeta.subTotal}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping fee</span>
          <span className="font-bold text-neutral-800">
            {cartMeta.fixedShippingFee}
          </span>
        </div>
        <div className="flex justify-between text-xs text-blue-600">
          <button type="button" onClick={() => alert("Apply discount flow")}>
            Apply discount code
          </button>
        </div>
        <div className="flex justify-between border-t pt-3 text-sm font-semibold text-neutral-800 sm:pt-4 sm:text-base">
          <span>Total</span>
          <span>{cartMeta.total}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-3 sm:pt-4">
        <Button
          onClick={handleSubmit}
          className="font-bebas w-full bg-[#1F3C88] py-2.5 text-sm tracking-wider text-white hover:bg-[#1a3474] sm:py-3 sm:text-base"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}

const LoadingGrid = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-full overflow-hidden rounded-lg bg-white shadow"
      >
        <div className="h-[300px] w-full animate-pulse bg-gray-200" />
        <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 sm:h-4" />
          <div className="flex justify-between">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-16" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center self-center py-8 sm:min-h-[400px] sm:py-12">
    <div className="rounded-full bg-gray-100 p-4 sm:p-6">
      <ShoppingCart className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
    </div>
    <p className="font-bebas text-sm tracking-wider text-neutral-600">
      {message}
    </p>
    <p className="profile_content">
      Browse our collection to find something you love
    </p>
    <Link href="/explore">
      <button className="font-bebas mt-4 rounded-lg bg-[#1E3A8A] px-5 py-2 text-xs font-medium tracking-wider text-white transition-colors hover:bg-blue-700 sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm">
        Browse Artworks
      </button>
    </Link>
  </div>
);
