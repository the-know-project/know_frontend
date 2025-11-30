"use client";
import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { useFetchUserCart } from "@/src/features/cart/hooks/use-fetch-user-cart";
import { useFetchOrdersSummary } from "@/src/features/orders/hooks/use-fetch-orders-summary";
import { useFetchUserOrders } from "@/src/features/orders/hooks/use-fetch-user-orders";
import { formatDate } from "@/src/utils/date";
import { showLog } from "@/src/utils/logger";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const tabs = ["Cart", "Pending Orders", "Completed Orders"];

const Page = () => {
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

  const { data: cartOrdersData, isLoading: cartLoading } = useFetchUserCart();

  const { data: pendingOrdersData, isLoading: pendingOrdersLoading } =
    useFetchUserOrders({
      status: "pending",
    });

  const { data: completedOrdersData, isLoading: completedOrdersLoading } =
    useFetchUserOrders({
      status: "completed",
    });

  const { data: ordersSummary } = useFetchOrdersSummary();

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const renderCart = () => {
    if (cartLoading) {
      return <LoadingGrid />;
    }

    const cartItems = cartOrdersData?.data || [];

    if (cartItems.length === 0) {
      return <EmptyState message="Your cart is empty" />;
    }

    return (
      <div className="grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2 lg:gap-6">
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
              className="w-fit items-center justify-center overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
            >
              <Image
                src={item.url || "/placeholder-art.jpg"}
                alt={"Artwork"}
                quality={100}
                width={400}
                height={300}
                className="object-contain object-center"
              />
              <div className="p-3 sm:p-4">
                <h3 className="profile_title">{item.title || "Untitled"}</h3>
                <p className="profile_content capitalize">
                  {`${item.artistFirstName} ${item.artistLastName}`}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{item.viewCount || 0}</span>
                  </div>
                  <Link href={`/checkout?orderId=${item.id}`}>
                    <button className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 sm:text-sm">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      Checkout
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

  const renderPendingOrders = () => {
    const pendingOrders = pendingOrdersData?.data?.orders || [];

    if (pendingOrdersLoading) {
      return <LoadingGrid />;
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
              <div className="flex w-fit items-center justify-center">
                <Image
                  src={`${order.assetUrl}` || "/placeholder-art.jpg"}
                  alt={order.name || "Artwork"}
                  quality={100}
                  width={400}
                  height={300}
                  className="rounded-lg object-contain object-center"
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
              className="w-fit overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
            >
              <Image
                src={`${order.assetUrl}` || "/placeholder-art.jpg"}
                alt={order.name || "Artwork"}
                quality={100}
                width={400}
                height={300}
                className="rounded-lg object-contain object-center"
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
      <div className="-mt-[50px] flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
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
              className={`font-bricolage text-[14px] capitalize hover:scale-105 active:scale-95 sm:text-[16px] lg:text-[18px] ${
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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="overflow-hidden rounded-lg bg-white shadow">
        <div className="h-48 w-full animate-pulse bg-gray-200 sm:h-64" />
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
  <div className="flex min-h-[300px] flex-col items-center justify-center py-8 sm:min-h-[400px] sm:py-12">
    <div className="rounded-full bg-gray-100 p-4 sm:p-6">
      <ShoppingCart className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
    </div>
    <p className="order_sub_title">{message}</p>
    <p className="profile_content">
      Browse our collection to find something you love
    </p>
    <Link href="/explore">
      <button className="font-bebas mt-4 rounded-lg bg-blue-600 px-5 py-2 text-xs font-medium tracking-wider text-white transition-colors hover:bg-blue-700 sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm">
        Browse Artworks
      </button>
    </Link>
  </div>
);

export default Page;
