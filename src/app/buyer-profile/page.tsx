"use client";
import { BuyerGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { mockOrders } from "@/src/features/profile/buyer/data/mock-data";
import { Eye, ThumbsUp, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  title: string;
  artist: string;
  views: number;
  likes?: number;
  imageUrl: string;
};

type UserProfile = {
  name: string;
  role: string;
  location: string;
  profileImage: string;
  stats: {
    postViews: string;
    followers: string;
    following: string;
    likes: string;
  };
  bio: string;
  email: string;
  memberSince: string;
};

const tabs = ["Work", "Appreciations", "Cart", "Pending Orders", "Completed Orders"];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("Appreciations");
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      // Replace with actual API call
      // const response = await fetch('/api/user/profile');
      // const data = await response.json();
      
      // Mock data - replace with actual API call
      const mockProfile: UserProfile = {
        name: "Hydon Precious",
        role: "Artist",
        location: "Lagos, Nigeria",
        profileImage: "/api/placeholder/64/64", // Replace with actual image
        stats: {
          postViews: "1.5M",
          followers: "1.3K",
          following: "392",
          likes: "3.5M"
        },
        bio: "For custom art, contact me at hydonprecious@gmail.com",
        email: "hydonprecious@gmail.com",
        memberSince: "NOVEMBER 2024"
      };
      
      setUserProfile(mockProfile);
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch orders based on active tab
    const fetchOrders = async () => {
      const normalizeKey = (label: string) => {
        const keyMap: { [key: string]: keyof typeof mockOrders } = {
          "Work": "cart",
          "Appreciations": "cart",
          "Cart": "cart",
          "Pending Orders": "pendingorders",
          "Completed Orders": "completedorders"
        };
        return keyMap[label] || "cart";
      };
      
      // Replace with actual API call based on tab
      // const response = await fetch(`/api/orders/${activeTab}`);
      // const data = await response.json();
      
      const key = normalizeKey(activeTab);
      if (mockOrders[key]) {
        setOrders(mockOrders[key]);
      } else {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleLike = async (orderId: string) => {
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

    // Send like to backend
    // await fetch('/api/orders/like', {
    //   method: 'POST',
    //   body: JSON.stringify({ orderId }),
    // });
  };

  const handleFollow = async () => {
    // Implement follow functionality
    // await fetch('/api/user/follow', {
    //   method: 'POST',
    //   body: JSON.stringify({ userId: userProfile?.id }),
    // });
  };

  if (!userProfile) {
    return (
      <BuyerGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </BuyerGuard>
    );
  }

  return (
    <BuyerGuard>
      <div className="py-8">
        <div className="flex gap-12">
          {/* Left Sidebar - Profile */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Profile Picture */}
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                      src={userProfile.profileImage} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Name and Title */}
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {userProfile.name}
                </h1>
                <p className="text-sm text-gray-600">{userProfile.role}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{userProfile.location}</span>
              </div>

              {/* Follow Button */}
              <button 
                onClick={handleFollow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md mb-6 transition-colors"
              >
                Follow
              </button>

              {/* Stats */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Post Views</span>
                  <span className="font-semibold text-gray-900">{userProfile.stats.postViews}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">{userProfile.stats.followers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Following</span>
                  <span className="font-semibold text-gray-900">{userProfile.stats.following}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-semibold text-gray-900">{userProfile.stats.likes}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Bio
                </h3>
                <p className="text-sm text-gray-700">
                  {userProfile.bio}
                </p>
              </div>

              {/* Member Since */}
              <div className="text-xs text-gray-500">
                MEMBER SINCE {userProfile.memberSince}
              </div>
            </div>
          </aside>

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
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No items found</p>
                <p className="text-gray-400 text-sm">
                  {activeTab === "Cart" && "Your cart is empty"}
                  {activeTab === "Pending Orders" && "You have no pending orders"}
                  {activeTab === "Completed Orders" && "You have no completed orders"}
                  {activeTab === "Work" && "No work to display"}
                  {activeTab === "Appreciations" && "No appreciations yet"}
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
