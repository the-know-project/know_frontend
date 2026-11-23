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
import { ShoppingCart } from "lucide-react";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { logger } from "@/src/utils/logger";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";

interface ExploreCardProps {
  id: number | string;
  userId: string;
  artistName: string;
  artName: string;
  artWork: string;
  highResUrl: string;
  extraUrls?: string[];
  highResExtraUrls?: string[];
  price: number;
  size: {
    width?: number;
    height?: number;
    depth?: number;
    diameter?: number;
    aspectRatio?: string;
    weight?: number;
    weightUnit?: string;
    dimensionUnit?: string;
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
  onArtistClick?: () => void;
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
  extraUrls,
  highResExtraUrls,
  description,
  artistImage,
  likeCount,
  isListed,
  role,
  categories,
  tags,
  onArtistClick,
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
  const artistId = useTokenStore(selectUserId);

  const showCartButton = useMemo(() => {
    return isCartHydrated && role.toLowerCase() === "buyer" && isListed;
  }, [isCartHydrated, role, isListed]);

  const { isItemInCart, toggleCart } = useCart({
    ctx: {
      fileId: id as string,
      price: price,
      quantity: 1,
      url: artWork,
    },
    enabled: showCartButton,
  });

  const processAddToCart = (userId: string, artistId: string) => {
    if (userId === artistId) {
      toast("Invalid action", {
        icon: <ToastIcon />,
        description: (
          <ToastDescription
            description={`Can not add your own artwork to the cart`}
          />
        ),
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });

      return;
    }

    toggleCart();
  };

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
      className="explore_card_wrapper transition-all"
      onContextMenu={handleContextMenu}
    >
      <div className="artwork-oak-frame group relative flex w-full flex-col shadow-lg transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]">
        <div className="artwork-oak-mat relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={highResUrl || artWork}
            alt="Artwork"
            quality={100}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="cursor-pointer object-contain transition-transform duration-300 select-none group-hover:scale-[1.02]"
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
                  extraUrls,
                  highResExtraUrls,
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
        </div>
        {highResExtraUrls && highResExtraUrls.length > 0 && (
          <div className="font-grotesk absolute top-3 right-3 z-10 flex items-center justify-center rounded-full bg-neutral-600 px-2 py-1 text-xs font-bold tracking-wider text-neutral-50 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95">
            <p>{highResExtraUrls.length}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onArtistClick}
            aria-label={`View ${artistName}'s profile`}
            className="explore_logo_wrapper rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
            disabled={!onArtistClick}
          >
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
          </button>

          <div className="flex flex-col items-start">
            <p className="font-helvetica text-[16px] text-neutral-800 capitalize sm:text-[18px]">
              {artistName}
            </p>
            <h3 className="font-grotesk text-sm font-normal text-neutral-800 underline">
              {artName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showCartButton && (
            <button
              onClick={() => processAddToCart(artistId!, userId)}
              className="group"
            >
              {isCartHydrated && isItemInCart ? (
                <IconShoppingCartFilled
                  width={30}
                  height={30}
                  className="text-[#1E3A8A] transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                />
              ) : (
                <IconShoppingCart
                  width={30}
                  height={30}
                  className="text-neutral-500 transition-all duration-200 group-hover:scale-105 group-active:scale-95"
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
                className="text-[#1E3A8A]"
              />
            ) : (
              <IconThumbUp
                width={30}
                height={30}
                className="text-neutral-500"
              />
            )}
          </button>

          <p className="font-grotesk text-[16px] font-bold text-neutral-800">
            {formatViewCount(currentLikeCount)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreCard;
