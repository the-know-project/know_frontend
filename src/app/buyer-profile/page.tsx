"use client";
import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { useFetchUserCart } from "@/src/features/cart/hooks/use-fetch-user-cart";
import { useRemoveFromCart } from "@/src/features/cart/hooks/use-remove-from-cart";
import { useUpdateQuantity } from "@/src/features/cart/hooks/use-update-quantity";
import { useCartActions } from "@/src/features/cart/state/cart.store";
import { IAddToLocalCart, TCart } from "@/src/features/cart/types/cart.types";
import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { useFetchOrdersSummary } from "@/src/features/orders/hooks/use-fetch-orders-summary";
import { useFetchUserOrders } from "@/src/features/orders/hooks/use-fetch-user-orders";
import { TOrdersData } from "@/src/features/orders/types/orders.types";
import ArtDetails from "@/src/shared/components/art-details";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/utils/date";
import { logger } from "@/src/utils/logger";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { useClearCart } from "@/src/features/cart/hooks/use-clear-cart";
import { useRouter } from "next/navigation";

const tabs = ["Cart", "Pending Orders", "Completed Orders"];

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Cart");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeTab);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  const { mutateAsync: removeItem } = useRemoveFromCart({ enabled: true });
  const { mutateAsync: updateQuantity } = useUpdateQuantity({
    enabled: true,
  });

  const { data: cartOrdersData, isLoading: cartLoading } = useFetchUserCart();
  const { getItemProps } = useCartActions();
  const quantityUpdateTimeouts = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  );
  const { mutateAsync: clearUserCart } = useClearCart();

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

    const timeout = setTimeout(async () => {
      quantityUpdateTimeouts.current.delete(ctx.fileId);
      const data = await updateQuantity(ctx);

      if (data.status !== 200) {
        toast("An error occurred", {
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
    }, 50);

    quantityUpdateTimeouts.current.set(ctx.fileId, timeout);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  useEffect(() => {
    return () => {
      quantityUpdateTimeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      quantityUpdateTimeouts.current.clear();
    };
  }, []);

  const { data: pendingOrdersData, isLoading: pendingOrdersLoading } =
    useFetchUserOrders({
      status: "pending",
    });

  const { data: completedOrdersData, isLoading: completedOrdersLoading } =
    useFetchUserOrders({
      status: "completed",
    });

  const { data: ordersSummary } = useFetchOrdersSummary();

  const { isExploreContentToggled } = useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();

  logger.debug("Cart data,", {
    cartOrdersData: cartOrdersData,
  });

  const openArtDetails = (id: string, content: IExploreContent) => {
    const viewportPosition = {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
    };
    logger.debug("Opening art details for ID:", {
      content: content,
    });
    toggleExploreContent(id, content, viewportPosition);
  };

  const handleOpenCartArtDetails = (item: TCart) => {
    const content: IExploreContent = {
      id: item.fileId,
      userId: item.artistId,
      creatorProfileUrl: item.artistProfilePicture || "",
      creatorName: `${item.artistFirstName} ${item.artistLastName}`.trim(),
      artName: item.title,
      description: null,
      artWorkUrl: item.url,
      highResUrl: item.highResUrl,
      extraUrls: [],
      highResExtraUrls: [],
      categories: [],
      price: item.price,
      size: {
        width: item.size?.width || 0,
        height: item.size?.height || 0,
        length: item.size?.length || 0,
        depth: item.size?.depth || 0,
        diameter: item.size?.diameter || 0,
        weight: item.size?.weight || 0,
        weightUnit: item.size?.weightUnit || "kg",
        dimensionUnit: item.size?.dimensionUnit || "cm",
        aspectRatio: item.size?.aspectRatio || "1:1",
      },
      tags: item.tags || [],
      numOfLikes: 0,
      numOfViews: item.viewCount || 0,
      numOfComments: 0,
      isListed: true,
      createdAt: new Date(item.createdAt),
    };

    openArtDetails(item.fileId, content);
  };

  const handleOpenOrderArtDetails = (order: TOrdersData) => {
    const content: IExploreContent = {
      id: order.fileId,
      userId: order.sellerId,
      creatorProfileUrl: order.artistProfilePicture || "",
      creatorName: `${order.artistFirstName} ${order.artistLastName}`.trim(),
      artName: order.name,
      description: null,
      artWorkUrl: order.assetUrl,
      highResUrl: order.highResUrl,
      extraUrls: [],
      highResExtraUrls: [],
      categories: [],
      tags: undefined,
      price: parseFloat(order.price),
      size: { width: 0, height: 0 },
      numOfLikes: 0,
      numOfViews: 0,
      numOfComments: 0,
      isListed: true,
      createdAt: new Date(order.createdAt),
    };

    openArtDetails(order.fileId, content);
  };

  const handleRemoveFromCart = async (ctx: IAddToLocalCart) => {
    await removeItem({
      fileId: ctx.fileId,
      price: ctx.price,
      quantity: ctx.quantity,
      url: ctx.url,
    });
  };

  const handleClearCart = async () => {
    const clearCartToastId = toast.loading(`Clearing user cart`, {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });

    const data = await clearUserCart();

    if (data.status === 200) {
      toast("Cart Cleared", {
        id: clearCartToastId,
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
    } else {
      toast("An error occurred", {
        id: clearCartToastId,
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

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const renderCart = () => {
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

    if (cartItems.length === 0) {
      return <EmptyState message="Your cart is empty" />;
    }

    return (
      <div className="relative flex w-full flex-col">
        <div className="grid w-full grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2 lg:items-start lg:justify-start lg:gap-6">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  delay: Math.min(index, 20) * 0.05,
                  ease: "easeInOut",
                  duration: 0.09,
                }}
                className="relative w-full max-w-[400px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
              >
                <Image
                  onClick={() => handleOpenCartArtDetails(item)}
                  src={item.url || "/placeholder-art.jpg"}
                  alt={"Artwork"}
                  quality={100}
                  width={500}
                  height={300}
                  className="w-full rounded-tl-[15px] rounded-tr-[15px] object-cover transition-all duration-300"
                />
                <div className="absolute right-0 bottom-0 left-0 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
                  <h3 className="font-helvetica font-bold text-neutral-50 capitalize sm:text-lg">
                    {item.title || "Untitled"}
                  </h3>
                  <p className="font-grotesk text-xs text-neutral-50 capitalize sm:text-sm">
                    {`${item.artistFirstName} ${item.artistLastName}`}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    {/*Price and quantity toggle*/}
                    <div className="flex flex-col items-start gap-2">
                      <div className="font-grotesk flex items-center gap-1 text-xs text-neutral-50 sm:text-sm">
                        <span
                          className="font-grotesk motion-preset-expand motion-duration-700 text-[15px] font-semibold tracking-wide text-neutral-50"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          {item.price}
                        </span>
                      </div>

                      <div className="flex w-full max-w-md items-center justify-between">
                        <IconCaretLeftFilled
                          onClick={() =>
                            handleQuantityUpdate({
                              fileId: item.fileId,
                              opts: "remove",
                            })
                          }
                          className="h-4 w-4 text-white sm:h-5 sm:w-5"
                        />
                        <span
                          className="font-grotesk motion-preset-expand motion-duration-600 font-semibold text-neutral-50"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          {item.quantity}
                        </span>

                        <IconCaretRightFilled
                          onClick={() =>
                            handleQuantityUpdate({
                              fileId: item.fileId,
                              opts: "add",
                            })
                          }
                          className="h-4 w-4 text-white sm:h-5 sm:w-5"
                        />
                      </div>
                    </div>

                    <div className="font-grotesk flex flex-col items-end gap-1 text-right">
                      <button
                        onClick={() =>
                          handleRemoveFromCart({
                            fileId: item.fileId,
                            price: item.price,
                            quantity: item.quantity,
                            url: item.url,
                          })
                        }
                        className="group flex items-center gap-1 rounded-[15px] bg-neutral-300 p-2 text-xs font-medium shadow-sm transition-colors sm:text-sm"
                      >
                        <Trash2 className="h-3 w-3 text-red-500 group-hover:scale-105 group-active:scale-95 sm:h-4 sm:w-4" />
                        <p className="font-bold text-red-500 group-hover:scale-105 group-active:scale-95">
                          Delete
                        </p>
                      </button>
                      <Link
                        href={`/checkout?orderId=${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="group flex items-center gap-1 rounded-[15px] bg-neutral-300 p-2 text-xs font-medium text-[#1E3A8A] shadow-sm transition-colors hover:text-blue-700 sm:text-sm">
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                          <p className="font-bold group-hover:scale-105 group-active:scale-95">
                            Checkout
                          </p>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/*Checkout & Clear Cart button*/}
        <div className="flex w-full flex-col self-center">
          <div className="mx-auto mt-[100px] flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:max-w-xl">
            <Button
              onClick={handleCheckout}
              className="font-bebas w-full bg-[#1F3C88] py-2.5 text-sm tracking-wider text-white transition-all duration-300 hover:scale-110 hover:bg-[#1a3474] active:scale-90 sm:py-3 sm:text-base"
            >
              <p>Checkout: {cartMeta.subTotal}</p>
            </Button>
            <Button
              onClick={handleClearCart}
              className="font-bebas w-full bg-neutral-600 py-2.5 text-sm tracking-wider text-white transition-all duration-300 hover:scale-110 hover:bg-[#1a3474] active:scale-90 sm:py-3 sm:text-base"
            >
              Clear cart
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPendingOrders = () => {
    const pendingOrders = pendingOrdersData?.data?.orders || [];

    if (pendingOrdersLoading) {
      return <LoadingPendingOrders />;
    }

    if (pendingOrders.length === 0) {
      return <EmptyState message="You have no pending orders" />;
    }

    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <AnimatePresence>
          {pendingOrders.map((order, index) => (
            <motion.div
              key={order.id}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: Math.min(index, 20) * 0.05,
                ease: "easeInOut",
                duration: 0.09,
              }}
              className="grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow sm:p-6 lg:grid-cols-2 lg:gap-6"
            >
              {/* Left Side - Artwork Image */}
              <div
                className="flex cursor-pointer items-center justify-center overflow-hidden"
                onClick={() => handleOpenOrderArtDetails(order)}
              >
                <Image
                  src={`${order.assetUrl}` || "/placeholder-art.jpg"}
                  alt={order.name || "Artwork"}
                  quality={100}
                  width={500}
                  height={300}
                  className="h-full w-full rounded-lg object-cover object-center"
                />
              </div>

              {/* Right Side - Order Details and Tracking */}
              <div className="flex flex-col justify-between">
                {/* Order Header */}
                <div>
                  <p className="profile_content capitalize">
                    {`${order.artistFirstName} ${order.artistLastName}`}
                  </p>
                  <h3 className="order_title">{order.name || "Untitled"}</h3>
                  <div className="mt-3 flex items-center justify-between border-b pb-3 sm:mt-4 sm:pb-4">
                    <p className="order_title">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                    <p className="profile_content">Qty: {order.quantity}</p>
                  </div>
                </div>

                {/* Order Tracking */}
                <div className="mt-4 sm:mt-6">
                  <h4 className="profile_title mb-3">Track your order</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Package Confirmed */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-orange-500 sm:h-3 sm:w-3"></div>
                      <div className="min-w-0 flex-1">
                        <p className="order_sub_title">Order Confirmed</p>
                        <p className="profile_content">
                          Status: {order.status}
                        </p>
                      </div>
                      <p className="profile_content">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Processing */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full sm:h-3 sm:w-3 ${
                          order.status === "accepted" ||
                          order.status === "fulfilled" ||
                          order.status === "completed"
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className="order_sub_title">Processing</p>
                        <p className="profile_content">
                          Your order is being prepared
                        </p>
                      </div>
                      <p className="profile_content">
                        {order.updatedAt ? formatDate(order.updatedAt) : ""}
                      </p>
                    </div>

                    {/* Completed */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full sm:h-3 sm:w-3 ${
                          order.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className="order_sub_title">Completed</p>
                        <p className="profile_content">Order fulfilled</p>
                      </div>
                      <p className="profile_content">
                        {order.completedAt ? formatDate(order.completedAt) : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-4 flex gap-3 sm:mt-6">
                  <Link href={`/orders/${order.id}`} className="flex-1">
                    <button className="font-bebas w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium tracking-wider text-neutral-800 transition-colors hover:bg-gray-50 sm:px-4 sm:text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderCompletedOrders = () => {
    const completedOrders = completedOrdersData?.data?.orders || [];

    if (completedOrdersLoading) {
      return <LoadingGrid />;
    }

    if (completedOrders.length === 0) {
      return <EmptyState message="You have no completed orders" />;
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
        <AnimatePresence>
          {completedOrders.map((order, index) => (
            <motion.div
              key={order.id}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: Math.min(index, 20) * 0.05,
                ease: "easeInOut",
                duration: 0.09,
              }}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
              onClick={() => handleOpenOrderArtDetails(order)}
            >
              <Image
                src={`${order.assetUrl}` || "/placeholder-art.jpg"}
                alt={order.name || "Artwork"}
                quality={100}
                width={500}
                height={300}
                className="h-[300px] w-full rounded-lg object-cover object-center"
              />
              <div className="p-3 sm:p-4">
                <h3 className="order_title capitalize">
                  {order.name || "Untitled"}
                </h3>
                <p className="profile_content capitalize">
                  {`${order.artistFirstName} ${order.artistLastName}`}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-left">
                    <p className="order_title">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                    <p className="profile_content">Qty: {order.quantity}</p>
                  </div>
                  <p className="profile_content">
                    {formatDate(order.completedAt || order.updatedAt)}
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="font-bricolage inline-flex w-fit items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 sm:ml-auto sm:text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <BuyerGuard>
      <div className="-mt-[50px] flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:items-start lg:justify-start lg:px-8">
        {isExploreContentToggled && <ArtDetails />}
        {/* Tabs */}
        <div
          ref={tabContainerRef}
          className="relative mb-6 flex w-full justify-around border-b border-gray-200 sm:mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              ref={(el) => {
                if (el) tabRefs.current.set(tab, el);
              }}
              onClick={() => setActiveTab(tab)}
              className={`font-bebas text-[16px] capitalize hover:scale-105 active:scale-95 lg:text-[18px] ${
                activeTab === tab
                  ? "font-semibold text-neutral-900 transition-colors duration-300"
                  : "text-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-gray-300"></div>
          {/* Active section highlight */}
          <div
            className="absolute bottom-0 h-[2px] rounded-full bg-gray-900 transition-all duration-300"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></div>
        </div>

        {/* Tab Content */}
        {activeTab === "Cart" && renderCart()}
        {activeTab === "Pending Orders" && renderPendingOrders()}
        {activeTab === "Completed Orders" && renderCompletedOrders()}
      </div>
    </BuyerGuard>
  );
};

const LoadingGrid = () => (
  <div className="grid w-full grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2 lg:items-start lg:justify-start lg:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="relative w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow"
      >
        {/* Pulse Image Skeleton maintaining the same 5:3 aspect ratio as width={500} height={300} */}
        <div className="aspect-[500/300] w-full animate-pulse bg-gray-200" />
        <div className="absolute right-0 bottom-0 left-0 space-y-2 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300/60 sm:h-5" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-300/50 sm:h-4" />
          <div className="flex justify-between pt-2">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-300/50 sm:h-4 sm:w-16" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-300/50 sm:h-4 sm:w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const LoadingPendingOrders = () => (
  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow sm:p-6 lg:grid-cols-2 lg:gap-6"
      >
        {/* Left Side - Image Skeleton */}
        <div className="flex items-center justify-center overflow-hidden">
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200 lg:h-80" />
        </div>

        {/* Right Side - Order Details Skeleton */}
        <div className="flex flex-col justify-between">
          {/* Order Header */}
          <div>
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 sm:h-4" />
            <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 sm:h-6" />
            <div className="mt-3 flex items-center justify-between border-b pb-3 sm:mt-4 sm:pb-4">
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-24" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200 sm:h-4" />
            </div>
          </div>

          {/* Order Tracking */}
          <div className="mt-4 sm:mt-6">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5" />
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-gray-300 sm:h-3 sm:w-3" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200 sm:h-4" />
                    <div className="h-2 w-32 animate-pulse rounded bg-gray-200 sm:h-3" />
                  </div>
                  <div className="h-2 w-16 animate-pulse rounded bg-gray-200 sm:h-3" />
                </div>
              ))}
            </div>
          </div>

          {/* Order Actions */}
          <div className="mt-4 flex gap-3 sm:mt-6">
            <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200 sm:h-10" />
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

export default Page;
