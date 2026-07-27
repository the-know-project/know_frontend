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

export function FeaturedWorksCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative w-full max-w-md sm:max-w-xl lg:max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="p-1">
              <Card className="border border-white/20 bg-black shadow-md">
                <CardContent className="flex aspect-square items-center justify-center p-6 text-white">
                  <span className="text-4xl font-semibold">{index + 1}</span>
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
