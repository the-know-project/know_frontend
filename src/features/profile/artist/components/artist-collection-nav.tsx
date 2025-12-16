"use client";

import { useAuthReady } from "@/src/features/auth/hooks/use-optimized-auth";
import { IconCirclePlus, IconSearch, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

type TCollectionNavToggle = "search" | "upload" | "profile";

const ArtistCollectionNav = () => {
  const [active, setActive] = useState<TCollectionNavToggle>("upload");
  const { user } = useAuthReady();
  return (
    <section className="flex w-full flex-col">
      <nav className="fixed bottom-0 min-w-[300px] items-center self-center rounded-full border border-white/20 bg-neutral-300/50 px-3 py-3 shadow-lg backdrop-blur-lg">
        <div className="flex flex-row items-center justify-between gap-[70px]">
          <IconSearch
            onClick={() => setActive("search")}
            width={24}
            height={24}
            className={`${active === "search" ? "scale-150 text-blue-800 transition-all duration-300" : "scale-100 text-neutral-500 transition-all duration-300"}`}
          />
          <IconCirclePlus
            onClick={() => setActive("upload")}
            width={24}
            height={24}
            className={`${active === "upload" ? "scale-150 text-blue-800 transition-all duration-300" : "scale-100 text-neutral-500 transition-all duration-300"}`}
          />
          <div>
            {user ? (
              <Image
                onClick={() => setActive("profile")}
                alt="user profile"
                src={user?.imageUrl || ""}
                width={30}
                height={30}
                className={`rounded-full object-contain object-center transition-all duration-300 ${active === "profile" ? "scale-150" : "scale-100"}`}
              />
            ) : (
              <IconUser
                onClick={() => setActive("profile")}
                width={24}
                height={24}
                className={`${active === "profile" ? "scale-150 text-blue-800 transition-all duration-300" : "scale-100 text-neutral-500 transition-all duration-300"} `}
              />
            )}
          </div>
        </div>
      </nav>
    </section>
  );
};

export default ArtistCollectionNav;
