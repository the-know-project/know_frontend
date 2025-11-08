// app/orders/page.tsx (or app/profile/buyer/page.tsx)
"use client";

import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { Eye, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFetchBuyerOrders } from "@/src/features/profilehooks/use-fetch-buyer-orders";
import { useLikeItem } from "@/src/features/profile/hooks/use-like-item";

type Order = {
  id: string;
  title: string;
  artist: string;
  views: number;
  likes?: number;
  imageUrl: string;
};

const tabs = ["Cart", "Pending Orders", "Completed Orders"];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("Cart");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Map tab to order type
  const getOrderType = (tab: string): "cart" | "pending" | "completed" => {
    const keyMap: Record<string, "cart" | "pending" | "completed"> = {
      "Cart": "cart",
      "Pending Orders": "pending",
      "Completed Orders": "completed"
    };
    return keyMap[tab] || "cart";
  };

  // Fetch orders based on active tab
  const { data: orders = [], isLoading: ordersLoading } = useFetchBuyerOrders(
    getOrderType(activeTab)
  );

  // Like mutation
  const likeMutation = useLikeItem();

  const handleLike = async (orderId: string) => {
    const isLiked = likedItems.has(orderId);

    // Toggle like state
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });

    // Send like to backend with optimistic update
    likeMutation.mutate({ itemId: orderId, isLiked });
  };

  return (
    <BuyerGuard>
      <div className="py-8">
        <div className="flex gap-12">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="mb-8 flex gap-8 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            {ordersLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded aspect-[4/3] mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No items found</p>
                <p className="text-gray-400 text-sm">
                  {activeTab === "Cart" && "Your cart is empty"}
                  {activeTab === "Pending Orders" && "You have no pending orders"}
                  {activeTab === "Completed Orders" && "You have no completed orders"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="group cursor-pointer"
                  >
                    {/* Image container with hover effect */}
                    <Link href={`/artwork/${order.id}`}>
                      <div className="relative overflow-hidden rounded bg-gray-100 mb-3 aspect-[4/3]">
                        <img
                          src={order.imageUrl}
                          alt={order.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Info section */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {order.title}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{order.artist}</p>
                        </div>
                        <button
                          onClick={() => handleLike(order.id)}
                          disabled={likeMutation.isPending}
                          className={`flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors ${
                            likedItems.has(order.id) ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${likedItems.has(order.id) ? 'fill-current' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{order.likes || Math.floor(order.views / 10)}K</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{order.views >= 1000 ? `${(order.views / 1000).toFixed(1)}K` : order.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </BuyerGuard>
  );
};

export default OrdersPage;
