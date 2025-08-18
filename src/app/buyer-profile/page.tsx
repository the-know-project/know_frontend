"use client";
import { PageAuthGuard } from "@/src/features/auth/guards";
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import { mockOrders } from "@/src/features/profile/buyer/data/mock-data";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const normalizeKey = (label: string) =>
      label.toLowerCase().replace(/\s/g, "") as keyof typeof mockOrders;

    const key = normalizeKey(activeTab);

    if (mockOrders[key]) {
      setOrders(mockOrders[key]);
    } else {
      setOrders([]); // fallback in case the key doesn't exist
    }
  }, [activeTab]);

  return (
    <EnhancedAuthProvider
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <PageAuthGuard requiredRoles={["BUYER"]} requiresAuth={true}>
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

            {/* Order Grid */}
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded bg-white shadow"
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
      </PageAuthGuard>
    </EnhancedAuthProvider>
  );
};

export default OrdersPage;
