import { IconArrowRight } from "@tabler/icons-react";
import { NavbarButton } from "../ui/resizable-navbar";
import GradientText from "./gradient-text";
import HeroCarousel from "./hero-carousel";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
      <div className="relative flex w-full flex-col items-center justify-center lg:flex-row lg:justify-between">
        <div className="absolute z-20 flex w-full flex-col gap-10 pl-4 sm:pl-0 lg:relative lg:w-2/4 lg:gap-8">
          <GradientText className="flex w-full p-0 md:p-6 lg:max-w-prose lg:p-0">
            <h3 className="font-bebas text-7xl font-black sm:text-8xl lg:text-8xl">
              {`Discover, Showcase & Own Art`}
            </h3>
          </GradientText>
          <div className="flex w-full flex-col gap-[80px] pl-1 md:pl-[2rem] lg:gap-[50px] lg:pl-[2.5rem]">
            <p className="font-grotesk max-w-prose text-lg font-medium text-neutral-100 capitalize md:text-2xl lg:text-xl">
              A blockchain-powered platform connecting{" "}
              <br className="hidden md:block" /> artist and buyers like never
              before
            </p>
            <NavbarButton
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
              className="w-fit"
            >
              <Link
                href={`/auth`}
                className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-xl font-medium text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 lg:text-lg"
              >
                Join The Movement
                <IconArrowRight
                  width={20}
                  height={20}
                  className="button_icon"
                />
              </Link>
            </NavbarButton>
          </div>
        </div>

        <div className="flex w-full items-end justify-end self-end lg:w-fit">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
