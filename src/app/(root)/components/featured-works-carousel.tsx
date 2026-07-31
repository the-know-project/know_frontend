"use client";

import { Card, CardContent } from "@/src/shared/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/shared/ui/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { featuredSectionsItems } from "@/src/constants/constants";
import Image from "next/image";
import {
  IconArrowsMaximize,
  IconPalette,
  IconShoppingCart,
  IconTag,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import Link from "next/link";

export function FeaturedWorksCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  const handleClick = () => {
    setIsClicked((prev) => !prev);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative w-full max-w-md sm:max-w-xl lg:max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {featuredSectionsItems.map((_item, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="p-1">
              <Card className="border border-white/20 bg-black shadow-md">
                <CardContent className="flex aspect-square items-center justify-center p-6 text-white">
                  <div className="relative flex aspect-square w-full flex-col">
                    <Image
                      onClick={handleClick}
                      src={_item.image}
                      alt="featured_art_1"
                      width={500}
                      height={500}
                      quality={100}
                      priority
                      className="h-full w-full object-cover"
                    />
                    <AnimatePresence>
                      {!isClicked && (
                        <motion.div
                          key={_item.id}
                          variants={variants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{
                            delay: Math.min(index, 20) * 0.05,
                            ease: "easeInOut",
                            duration: 0.09,
                          }}
                          className="absolute inset-x-0 bottom-0 flex w-full flex-col items-start bg-white/10 p-3 backdrop-blur-sm sm:p-4"
                        >
                          <div className="flex w-full items-start justify-between">
                            {" "}
                            {/* Ensure this container takes full width and justifies content */}
                            <div className="flex flex-col items-start">
                              <h3 className="font-helvetica text-glow text-lg font-black text-white capitalize sm:text-2xl">
                                {_item.title}
                              </h3>
                              <p className="font-grotesk text-glow text-sm font-bold text-neutral-50 sm:text-lg">
                                {_item.artist}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="font-bebas text-glow flex text-lg font-bold tracking-wider text-neutral-50">
                                {_item.price}
                              </p>
                            </div>
                          </div>

                          <div className="justfy-between mt-2 flex w-full items-start">
                            <div className="flex w-full flex-col">
                              <div className="flex w-full items-center gap-1">
                                <IconPalette className="hidden text-neutral-50 sm:flex" />
                                <p className="font-grotesk sm:text-md max-w-prose text-[10px] text-neutral-50 uppercase">
                                  {_item.medium}
                                </p>
                              </div>

                              <div className="flex w-full items-center gap-1">
                                <IconArrowsMaximize className="hidden text-neutral-50 sm:flex" />
                                <p className="font-grotesk sm:text-md max-w-prose text-[10px] text-neutral-50 uppercase">
                                  {_item.size}
                                </p>
                              </div>
                            </div>

                            <NavbarButton
                              colors={[
                                "#FF5733",
                                "#33FF57",
                                "#3357FF",
                                "#F1C40F",
                              ]}
                              className="w-fit"
                            >
                              <Link
                                href={`/login`}
                                className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-black p-1 text-sm font-medium tracking-wider text-white capitalize outline outline-[#fff2f21f] transition-all duration-200"
                              >
                                <IconShoppingCart className="text-white" />
                              </Link>
                            </NavbarButton>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
