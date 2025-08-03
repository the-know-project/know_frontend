"use client";

import {
  IconShoppingCart,
  IconShoppingCartFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "../../cart/hooks/use-cart";
import { useAssetLike } from "../hooks/use-asset-like";
import { formatViewCount } from "@/src/utils/number-format";
import { useToggleExploreContent } from "../state/explore-content.store";

interface ExploreCardProps {
  id: number | string;
  artistName: string;
  artName: string;
  artWork: string;
  artistImage: string;
  likeCount: number;
  isListed: boolean;
  role: string;
  description: string | null;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  id,
  artistName,
  artName,
  artWork,
  description,
  artistImage,
  likeCount,
  isListed,
  role,
}) => {
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

  const { isItemInCart, toggleCart } = useCart({
    fileId: id as string,
  });
  const toggleExploreContent = useToggleExploreContent();

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
                artName,
                artWorkUrl: artWork,
                description,
                creatorProfileUrl: artistImage,
                creatorName: artistName,
              },
              viewportPosition,
            );
          }}
          priority
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="explore_logo_wrapper">
            <Image
              src={artistImage}
              alt="logo"
              width={30}
              height={30}
              className="rounded-full object-contain object-center select-none"
              style={{
                userSelect: "none",
              }}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="font-bricolage text-[18px] font-black text-neutral-800 capitalize">
              {artistName}
            </p>
            <h3 className="font-bricolage text-sm font-semibold text-neutral-700 underline">
              {artName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role.toLowerCase() === "buyer" && isListed && (
            <button onClick={toggleCart} className="group">
              {isItemInCart ? (
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
