"use client";

import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { IconNotification, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import ExploreForm from "./explore-form";

const ExploreNav = () => {
  return (
    <nav className="motion-preset-expand motion-duration-700 relative z-50 flex w-full flex-col gap-1 py-1">
      <div className="flex w-full px-4 sm:hidden">
        <ExploreForm
          onSearch={(query) => {
            console.log(`Searching for ${query}`);
          }}
          placeholder="Explore"
          debounceMs={300}
        />
      </div>
      <div className="flex items-center justify-between px-4 sm:px-6">
        <div className="explore_logo_wrapper">
          <Image
            src="/Know-Logo.png"
            alt="logo"
            width={40}
            height={40}
            className="object-contain object-center"
          />
        </div>

        <div className="hidden w-full max-w-[300px] sm:flex">
          <ExploreForm
            onSearch={(query) => {
              console.log(`Searching for ${query}`);
            }}
            placeholder="Explore"
            debounceMs={300}
          />
        </div>

        <div className="flex items-center gap-5">
          <NavbarButton
            colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            className="w-fit"
          >
            <button className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-[12px] font-medium text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 sm:text-[16px]">
              <p className="block">share your work</p>
            </button>
          </NavbarButton>

          <div className="explore_nav_wrapper">
            <div className="flex items-center gap-2 bg-transparent px-2">
              <IconNotification
                color="black"
                className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]"
              />
              <IconUser
                color="black"
                className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ExploreNav;
