"use client";

import { formatViewCount } from "@/src/utils/number-format";
import {
  IconShoppingCart,
  IconShoppingCartFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useCart } from "../../cart/hooks/use-cart";
import { useCartHydration } from "../../cart/state/cart.store";
import { useAssetLike } from "../hooks/use-asset-like";
import { useToggleExploreContent } from "../state/explore-content.store";
import { Settings2Icon } from "lucide-react";

interface ExploreCardProps {
  id: number | string;
  userId: string;
  artistName: string;
  artName: string;
  artWork: string;
  highResUrl: string;
  price: number;
  size: {
    width: number;
    height: number;
  };
  numOfViews: number;
  createdAt: Date;
  artistImage: string;
  likeCount: number;
  isListed: boolean;
  role: string;
  description: string | null;
  categories: string[];
  tags: string[] | undefined;
  isEditingCollection?: boolean;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  id,
  userId,
  artistName,
  price,
  size,
  numOfViews,
  createdAt,
  artName,
  artWork,
  highResUrl,
  description,
  artistImage,
  likeCount,
  isListed,
  role,
  categories,
  tags,
  isEditingCollection = false,
}) => {
  const isCartHydrated = useCartHydration();

  const {
    isLiked,
    likeCount: currentLikeCount,
    toggleLike,
    isLoading,
    error,
  } = useAssetLike({
    assetId: id,
    initialLikeCount: likeCount,
  });

  const toggleExploreContent = useToggleExploreContent();

  const showCartButton = useMemo(() => {
    return isCartHydrated && role.toLowerCase() === "buyer" && isListed;
  }, [isCartHydrated, role, isListed]);

  const { isItemInCart, toggleCart } = useCart({
    fileId: id as string,
    enabled: showCartButton,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+S, Ctrl+Shift+I, F12, etc.
      if (
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  if (error) {
    console.log(error);
  }

  return (
    <section
      className="explore_card_wrapper transition-all duration-300 hover:scale-105 active:scale-95"
      onContextMenu={handleContextMenu}
    >
      <div className="relative flex w-full flex-col rounded-[15px] shadow-sm">
        <Image
          src={artWork}
          alt="Artwork"
          quality={100}
          width={500}
          height={300}
          className="rounded-[15px] object-cover select-none"
          onClick={() => {
            const viewportPosition = {
              scrollY: window.scrollY,
              viewportHeight: window.innerHeight,
            };
            toggleExploreContent(
              id as string,
              {
                id: id as string,
                userId: userId,
                artName,
                artWorkUrl: artWork,
                highResUrl,
                description,
                creatorProfileUrl: artistImage,
                creatorName: artistName,
                categories,
                tags,
                price: price,
                size: size,
                numOfLikes: likeCount,
                numOfViews: numOfViews,
                numOfComments: 0,
                isListed: isListed,
                createdAt: createdAt,
              },
              viewportPosition,
            );
          }}
          priority
        />
        {isEditingCollection && (
          <div className="absolute top-2 left-2 z-30 rounded-3xl bg-neutral-500/10 p-2 shadow-lg backdrop-blur-2xl">
            <Settings2Icon width={24} height={25} className="text-white" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="explore_logo_wrapper">
            <Image
              src={artistImage}
              alt="logo"
              width={30}
              height={30}
              className="rounded-full object-cover object-center select-none"
              style={{
                userSelect: "none",
              }}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="font-bricolage text-lg font-black text-neutral-800 capitalize">
              {artistName}
            </p>
            <h3 className="font-bricolage text-sm font-semibold text-neutral-700 underline">
              {artName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showCartButton && (
            <button onClick={toggleCart} className="group">
              {isCartHydrated && isItemInCart ? (
                <IconShoppingCartFilled
                  width={30}
                  height={30}
                  className="text-purple-700 transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                />
              ) : (
                <IconShoppingCart
                  width={30}
                  height={30}
                  className="text-neutral-700 transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                />
              )}
            </button>
          )}
          <button
            onClick={toggleLike}
            disabled={isLoading}
            className="transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            {isLiked ? (
              <IconThumbUpFilled
                width={30}
                height={30}
                className="text-blue-600"
              />
            ) : (
              <IconThumbUp
                width={30}
                height={30}
                className="text-neutral-500"
              />
            )}
          </button>

          <p className="font-bricolage text-[16px] font-bold text-neutral-900">
            {formatViewCount(currentLikeCount)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreCard;
