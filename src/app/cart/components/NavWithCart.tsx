"use client";
import { useState } from "react";
import Link from "next/link";
import { CartIconBadge, CartDrawer } from "@/src/features/cart/components";

export const NavWithCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 flex items-center justify-between border-b bg-white p-4">
        <Link href="/" className="text-xl font-bold">
          Your Logo
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/explore"
            className="transition-colors hover:text-gray-600"
          >
            Explore
          </Link>
          <Link
            href="/profile"
            className="transition-colors hover:text-gray-600"
          >
            Profile
          </Link>

          <CartIconBadge onClick={() => setIsCartOpen(true)} />
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
