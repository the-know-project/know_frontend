"use client";
import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useBuyerCart,
  useBuyerPendingOrders,
  useBuyerCompletedOrders,
} from "@/src/features/profile/buyer/hooks/use-buyer-orders";
import { useTokenStore } from "@/src/features/auth/state/store";

type Order = {
  id: string;
  title: string;
  artist: string;
  views: number;
  imageUrl: string;
};

const tabs = ["Cart", "Pending Orders", "Completed Orders"];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("Cart");

  const token = useTokenStore((state) => state.accessToken);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);

  useEffect(() => {
    console.log("🔍 OrdersPage Token Debug:", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 30) + "..." : "NO TOKEN",
      isAuthenticated,
    });
  }, [token, isAuthenticated]);

  const cartQuery = useBuyerCart();
  const pendingQuery = useBuyerPendingOrders();
  const completedQuery = useBuyerCompletedOrders();

  const currentQuery =
    activeTab === "Cart"
      ? cartQuery
      : activeTab === "Pending Orders"
        ? pendingQuery
        : completedQuery;

  const { data: ordersData, isLoading, error } = currentQuery;

  const orders: Order[] = ordersData?.orders || ordersData?.data || [];

  return (
    <BuyerGuard>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6">
          {/* Tabs */}
          <div className="mb-6 flex justify-around border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded bg-white shadow"
                >
                  <div className="h-48 w-full animate-pulse bg-gray-200" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="font-medium text-red-500">Failed to load orders</p>
              <p className="mt-2 text-sm text-gray-500">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">No orders found.</p>
              <p className="mt-2 text-sm text-gray-400">
                {activeTab === "Cart" && "Your cart is empty"}
                {activeTab === "Pending Orders" && "You have no pending orders"}
                {activeTab === "Completed Orders" &&
                  "You have no completed orders"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded bg-white shadow transition-shadow hover:shadow-lg"
                >
                  <img
                    src={order.imageUrl}
                    alt={order.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold">{order.title}</h3>
                    <p className="text-sm text-gray-500">{order.artist}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {order.views.toLocaleString()}
                      </div>
                      <Link href="/checkout">
                        <button className="flex items-center gap-1 text-blue-600 hover:underline">
                          <ShoppingCart className="h-4 w-4" />
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </BuyerGuard>
  );
};

export default OrdersPage;
