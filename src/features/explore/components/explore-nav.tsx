"use client";

import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { IconNotification, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import ExploreForm from "./explore-form";
import { useTokenStore } from "../../auth/state/store";
import { useRouter } from "next/navigation";

const ExploreNav = () => {
  const router = useRouter();
  const user = useTokenStore((state) => state.user);

  const handleShareWork = () => {
    router.push("/upload");
  };

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
          {user && user?.role === "ARTIST" && (
            <NavbarButton
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
              className="w-fit"
            >
              <button
                className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-sm font-medium text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 sm:text-[16px]"
                onClick={handleShareWork}
              >
                <p className="block">share your work</p>
              </button>
            </NavbarButton>
          )}

          <div className="explore_nav_wrapper">
            <div className="flex items-center gap-2 bg-transparent px-2">
              <IconNotification color="black" className="h-[30px] w-[30px]" />
              {user?.imageUrl ? (
                <Image
                  alt="user profile"
                  src={user?.imageUrl}
                  width={30}
                  height={30}
                  className="rounded-full object-contain object-center"
                />
              ) : (
                <IconUser color="black" className="h-[30px] w-[30px]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ExploreNav;
