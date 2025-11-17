"use client";
import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { useFetchUserCart } from "@/src/features/cart/hooks/use-fetch-user-cart";
import { useFetchOrdersSummary } from "@/src/features/orders/hooks/use-fetch-orders-summary";
import { useFetchUserOrders } from "@/src/features/orders/hooks/use-fetch-user-orders";
import { formatDate } from "@/src/utils/date";
import { showLog } from "@/src/utils/logger";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs = ["Cart", "Pending Orders", "Completed Orders"];

const Page = () => {
  const [activeTab, setActiveTab] = useState("Cart");

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

  showLog({
    context: "Cart Orders Data",
    data: cartOrdersData,
  });

  showLog({
    context: "Pending Orders",
    data: pendingOrdersData,
  });

  showLog({
    context: "Completed Orders",
    data: completedOrdersData,
  });

  showLog({
    context: "Orders Summary",
    data: ordersSummary,
  });

  const renderCart = () => {
    if (cartLoading) {
      return <LoadingGrid />;
    }

    const cartItems = cartOrdersData?.data || [];
    showLog({
      context: "Cart Items",
      data: cartItems,
    });

    if (cartItems.length === 0) {
      return <EmptyState message="Your cart is empty" />;
    }

    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
          >
            <img
              src={item.url || "/placeholder-art.jpg"}
              alt={"Artwork"}
              className="h-40 w-full object-cover sm:h-48 md:h-64"
            />
            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">
                {item.title || "Untitled"}
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                {`${item.artistFirstName} ${item.artistLastName}`}
              </p>
              <div className="mt-2 flex items-center justify-between sm:mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
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
          </div>
        ))}
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
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {pendingOrders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 shadow sm:gap-4 sm:p-4 lg:grid-cols-2 lg:gap-6 lg:p-6"
          >
            {/* Left Side - Artwork Image */}
            <div className="flex items-center justify-center">
              <img
                src={`/api/files/${order.fileId}` || "/placeholder-art.jpg"}
                alt={order.name || "Artwork"}
                className="h-48 w-full rounded-lg object-cover sm:h-64 lg:h-80"
              />
            </div>

            {/* Right Side - Order Details and Tracking */}
            <div className="flex flex-col justify-between">
              {/* Order Header */}
              <div>
                <p className="text-xs text-gray-500">
                  {`${order.artistFirstName} ${order.artistLastName}`}
                </p>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                  {order.name || "Untitled"}
                </h3>
                <div className="mt-2 flex items-center justify-between border-b pb-2 sm:mt-3 sm:pb-3 lg:mt-4 lg:pb-4">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="mt-3 sm:mt-4 lg:mt-6">
                <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 lg:mb-4">
                  Track your order
                </h4>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {/* Package Confirmed */}
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        Order Confirmed
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {order.status}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Processing */}
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 ${
                        order.status === "accepted" ||
                        order.status === "fulfilled" ||
                        order.status === "completed"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        Processing
                      </p>
                      <p className="text-xs text-gray-500">
                        Your order is being prepared
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.updatedAt ? formatDate(order.updatedAt) : ""}
                    </p>
                  </div>

                  {/* Completed */}
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 ${
                        order.status === "completed"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        Completed
                      </p>
                      <p className="text-xs text-gray-500">Order fulfilled</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.completedAt ? formatDate(order.completedAt) : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-3 flex gap-2 sm:mt-4 lg:mt-6 lg:gap-3">
                <Link href={`/orders/${order.id}`} className="flex-1">
                  <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-4 sm:text-sm">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
        {completedOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
          >
            <img
              src={`/api/files/${order.fileId}` || "/placeholder-art.jpg"}
              alt={order.name || "Artwork"}
              className="h-40 w-full object-cover sm:h-48 md:h-64"
            />
            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">
                {order.name || "Untitled"}
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                {`${order.artistFirstName} ${order.artistLastName}`}
              </p>
              <div className="mt-2 flex items-center justify-between sm:mt-3">
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDate(order.completedAt || order.updatedAt)}
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:items-center">
                <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 sm:px-2.5">
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
          </div>
        ))}
      </div>
    );
  };

  return (
    <BuyerGuard>
      <div className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
        {/* Tabs - Optimized for mobile */}
        <div className="mb-4 flex justify-around border-b border-gray-200 sm:mb-6 lg:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[10px] font-medium transition-colors sm:pb-3 sm:text-xs md:text-sm ${
                activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
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
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="overflow-hidden rounded-lg bg-white shadow">
        <div className="h-40 w-full animate-pulse bg-gray-200 sm:h-48 md:h-64" />
        <div className="space-y-2 p-3 sm:p-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="flex justify-between">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-[250px] flex-col items-center justify-center py-6 sm:min-h-[300px] sm:py-8 lg:min-h-[400px] lg:py-12">
    <div className="rounded-full bg-gray-100 p-3 sm:p-4 lg:p-6">
      <ShoppingCart className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
    </div>
    <p className="mt-3 text-sm font-medium text-gray-900 sm:text-base lg:text-lg">
      {message}
    </p>
    <p className="mt-2 px-4 text-center text-xs text-gray-500 sm:text-sm">
      Browse our collection to find something you love
    </p>
    <Link href="/explore">
      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:px-5 sm:text-sm lg:mt-6 lg:px-6 lg:py-2.5">
        Browse Artworks
      </button>
    </Link>
  </div>
);

export default Page;
