"use client";

import { about_image } from "@/src/assets";
import useIsVisible from "@/src/shared/hooks/use-is-visible";
import { TitleText } from "@/src/shared/layout/header";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import Image from "next/image";

const Intro = () => {
  const { ref, isVisible } = useIsVisible();
  return (
    <div className="z-50 flex w-full flex-col px-6 py-12">
      <div className="flex w-full flex-col gap-5 lg:flex-row-reverse lg:items-center lg:justify-between">
        <TitleText textStyles={`w-full max-w-prose`}>
          <h3 className="font-helvetica text-2xl font-black text-neutral-400 capitalize md:text-3xl">
            the <span className="text-neutral-950">all-in-one</span> platform to{" "}
            <span className="text-neutral-950"> create, earn </span> and{" "}
            <span className="text-neutral-950">grow</span>
          </h3>
          <p className="about_content_text mt-4">
            We are the ultimate partner app for creators worldwide. Our mission
            is to empower artists by giving them everything they need in one
            place; from making art to selling it- streamlining every step of the
            creative journey.
          </p>
        </TitleText>

        <div
          ref={ref}
          className={`${isVisible ? "motion-preset-expand motion-duration-1000" : "opacity-0"}`}
        >
          <NavbarButton
            colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            className="relative z-10 flex"
          >
            <Image
              src={about_image}
              alt="about_iamge"
              width={500}
              height={500}
              quality={100}
              className="z-20 h-full w-full rounded-xl object-cover opacity-90 lg:w-[700px]"
            />
          </NavbarButton>
        </div>
      </div>
    </div>
  );
};

export default Intro;
