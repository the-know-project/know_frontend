"use client";

import { HeroCarouselItems } from "@/src/constants/constants";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";
import Image from "next/image";

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === HeroCarouselItems.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? HeroCarouselItems.length - 1 : prev - 1,
    );
  };

  const carouselHandler = useSwipeable({
    onSwipedLeft: () => handlePrev(),
    onSwipedRight: () => handleNext(),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="flex w-full flex-col">
      <div {...carouselHandler} className="w-full">
        <div className="relative h-[900px] w-[700px] overflow-hidden sm:w-[750px] md:rounded-[15px]">
          {HeroCarouselItems.map((item, index) => (
            <Image
              key={index}
              src={item.image}
              alt={`hero_image_${index}`}
              quality={100}
              fill
              className={`absolute top-0 left-0 h-full w-full object-cover blur-xl transition-opacity duration-1000 ease-in-out md:blur-none ${index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"} `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
