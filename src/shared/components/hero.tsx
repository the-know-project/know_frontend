import { IconArrowRight } from "@tabler/icons-react";
import { NavbarButton } from "../ui/resizable-navbar";
import GradientText from "./gradient-text";
import HeroCarousel from "./hero-carousel";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen w-full flex-col bg-black">
      <div className="relative flex w-full flex-col items-center justify-center md:flex-row md:justify-between">
        <div className="absolute z-20 flex w-full flex-col gap-10 pl-4 sm:pl-0 md:relative md:w-2/4 md:gap-8">
          <GradientText className="flex w-full sm:max-w-prose">
            <h3 className="font-marker text-6xl font-black sm:text-6xl md:text-8xl">
              Discover, Showcase And Own Art
            </h3>
          </GradientText>
          <div className="flex w-full flex-col gap-[80px] pl-0 sm:pl-[3rem] md:gap-[50px]">
            <p className="font-bebas max-w-prose text-2xl font-light text-neutral-100">
              A blockchain-powered platform connecting artist and buyers like
              never before
            </p>
            <NavbarButton
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
              className="w-fit"
            >
              <Link
                href={`/auth`}
                className="font-bebas md:text-md relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-2.5 py-1.5 text-xl font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 md:w-fit md:text-lg"
              >
                Get Started{" "}
                <IconArrowRight
                  width={20}
                  height={20}
                  className="button_icon"
                />
              </Link>
            </NavbarButton>
          </div>
        </div>

        <div className="flex w-full items-end justify-end self-end md:w-fit">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
