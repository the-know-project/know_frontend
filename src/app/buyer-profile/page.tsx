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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
          >
            <img
              src={item.url || "/placeholder-art.jpg"}
              alt={"Artwork"}
              className="h-64 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500">
                {`${item.artistFirstName} ${item.artistLastName} `}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{item.viewCount || 0}</span>
                </div>
                <Link href={`/checkout?orderId=${item.id}`}>
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                    <ShoppingCart className="h-4 w-4" />
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
      <div className="space-y-8">
         {/*Order data has types dont use any here. the order type is infered */}
        {pendingOrders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-1 gap-6 rounded-lg bg-white p-6 shadow lg:grid-cols-2"
          >
            {/* Left Side - Artwork Image */}
            <div className="flex items-center justify-center">
              <img
                src={order.artwork?.images?.[0]?.url || "/placeholder-art.jpg"}
                alt={order.artwork?.title || "Artwork"}
                className="h-80 w-full rounded-lg object-cover"
              />
            </div>

            {/* Right Side - Order Details and Tracking */}
            <div className="flex flex-col justify-between">
              {/* Order Header */}
              <div>
                <p className="text-sm text-gray-500">
                  {order.artwork?.artist?.name || "Unknown Artist"}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {order.artwork?.title || "Untitled"}
                </h3>
                <div className="mt-4 flex items-center justify-between border-b pb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {order.quantity || 1}
                  </p>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="mt-6">
                <h4 className="mb-4 font-semibold text-gray-900">
                  Track your order
                </h4>
                <div className="space-y-4">
                  {/* Package Confirmed */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-orange-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Package Confirmed
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress?.city || "City"},{" "}
                        {order.shippingAddress?.country || "Country"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* In Transit */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        order.status === "shipped" ||
                        order.status === "delivered"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        In transit with carrier
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress?.state || "State"},{" "}
                        {order.shippingAddress?.country || "Country"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.estimatedDeliveryDate
                        ? formatDate(order.estimatedDeliveryDate)
                        : "TBD"}
                    </p>
                  </div>

                  {/* Arrived at Depot */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        order.status === "delivered"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Arrived at local depot
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress?.state || "State"},{" "}
                        {order.shippingAddress?.country || "Country"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.deliveredAt ? formatDate(order.deliveredAt) : ""}
                    </p>
                  </div>

                  {/* If Delivered to Destination */}
                  {order.status === "delivered" && order.deliveredAt && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Delivered to destination
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.address || "Address"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.deliveredAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-6 flex gap-3">
                <Link href={`/orders/${order.id}`} className="flex-1">
                  <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    View Details
                  </button>
                </Link>
                {order.trackingNumber && (
                  <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    Track Package
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * 
   * @Dev The order data has type declaration. use that to assign the right values
   */
  const renderCompletedOrders = () => {
    const completedOrders = completedOrdersData?.data?.orders || [];

    if (completedOrdersLoading) {
      return <LoadingGrid />;
    }

    if (completedOrders.length === 0) {
      return <EmptyState message="You have no completed orders" />;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/*Order data has types dont use any here. the order type is infered */}
        {completedOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
          >
            <img
              src={order.artwork?.images?.[0]?.url || "/placeholder-art.jpg"}
              alt={order.artwork?.title || "Artwork"}
              className="h-64 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {order.artwork?.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500">
                {order.artwork?.artist?.name || "Unknown Artist"}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{order.artwork?.views?.toLocaleString() || 0}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.deliveredAt || order.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Delivered
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700"
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
      <div className="w-full">
        {/* Tabs */}
        <div className="mb-8 flex justify-around border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
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
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="overflow-hidden rounded-lg bg-white shadow">
        <div className="h-64 w-full animate-pulse bg-gray-200" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
    <div className="rounded-full bg-gray-100 p-6">
      <ShoppingCart className="h-12 w-12 text-gray-400" />
    </div>
    <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
    <p className="mt-2 text-sm text-gray-500">
      Browse our collection to find something you love
    </p>
    <Link href="/explore">
      <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        Browse Artworks
      </button>
    </Link>
  </div>
);

export default Page;
