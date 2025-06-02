"use client";

import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { DummyArtPreferences } from "../data/personalize.data";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ArtSelection = () => {
  const [selectedArt, setSelectedArt] = useState<string[]>([]);

  const handleSelection = (pref: string) => {
    setSelectedArt((prev) => {
      if (prev.includes(pref)) {
        return prev.filter((item) => item !== pref);
      } else {
        return [...prev, pref];
      }
    });
  };

  console.log(selectedArt);

  const isItemSelected = (item: string) => selectedArt.includes(item);

  return (
    <section className="relative flex w-full flex-col">
      <div className="z-50 grid w-full grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
        {DummyArtPreferences.map((pref, index) => (
          <button
            key={pref.id}
            className="motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit rounded-md bg-black px-2 py-1 text-[16px] font-bold text-nowrap text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            onClick={() => handleSelection(pref.name)}
          >
            <p
              className={cn(
                "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
                isItemSelected(pref.name) && "text-neutral-700",
              )}
            >
              {pref.name}
            </p>
          </button>
        ))}
      </div>

      <NavbarButton
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        className="mt-[150px] flex w-full items-center justify-center self-center"
      >
        <button className="font-bebas group relative inline-flex w-full items-center justify-center gap-1 self-center rounded-lg bg-black px-2.5 py-1.5 text-[16px] font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-300 hover:scale-110 active:scale-95">
          Get Started{" "}
          <IconArrowRight width={20} height={20} className="button_icon" />
        </button>
      </NavbarButton>
    </section>
  );
};

export default ArtSelection;
