import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { DummyArtPreferences } from "../data/personalize.data";
import { IconArrowRight } from "@tabler/icons-react";

const ArtSelection = () => {
  return (
    <section className="relative flex w-full flex-col">
      <div className="z-50 grid w-full grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4">
        {DummyArtPreferences.map((pref, index) => (
          <button
            key={index}
            className="motion-duration-500 motion-preset-expand font-bebas transiton-all flex w-fit rounded-md bg-black px-2 py-1 text-sm font-bold text-nowrap text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {pref.name}
          </button>
        ))}
      </div>

      <NavbarButton
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        className="mt-[100px] flex w-full items-center justify-center self-center"
      >
        <button className="font-bebas text-md group relative inline-flex w-full items-center justify-center gap-1 self-center rounded-lg bg-black px-2.5 py-1.5 font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-300 hover:scale-110 active:scale-95">
          Get Started{" "}
          <IconArrowRight width={20} height={20} className="button_icon" />
        </button>
      </NavbarButton>
    </section>
  );
};

export default ArtSelection;
