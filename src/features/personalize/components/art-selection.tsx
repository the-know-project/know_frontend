"use client";

import { cn } from "@/lib/utils";
import Spinner from "@/src/shared/components/spinner";
import ToastDescription from "@/src/shared/components/toast-description";
import ToastIcon from "@/src/shared/components/toast-icon";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DummyArtPreferences } from "../data/personalize.data";
import { useGetCategories, usePersonalizeExp } from "../hooks";
import ArtSelectionSkeleton from "./art-selection-skeleton";

interface IPersonalizeExp {
  status: number;
  message: string;
}

const ArtSelection = () => {
  const { data, isLoading, error } = useGetCategories();
  const { mutateAsync: personalizeExp, isPending } = usePersonalizeExp();
  const [selectedArt, setSelectedArt] = useState<string[]>([]);
  const router = useRouter();

  const handleSelection = (pref: string) => {
    setSelectedArt((prev) => {
      if (prev.includes(pref)) {
        return prev.filter((item) => item !== pref);
      } else {
        return [...prev, pref];
      }
    });
  };

  const isItemSelected = (item: string) => selectedArt.includes(item);

  const handleToast = (data: IPersonalizeExp) => {
    if (data.status === 200) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: " oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
      router.push("/explore");
    } else if (data.status === 400) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    } else {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={`An error occurred`} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    }
  };

  const handlePersonalizeExp = async () => {
    const data = await personalizeExp(selectedArt);
    handleToast(data);
  };

  if (isLoading) {
    return <ArtSelectionSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Error fetching categories</div>;
  }

  const artPreferences = data ? data.data.slice(0, 35) : DummyArtPreferences;

  return (
    <section className="relative flex w-full flex-col">
      <div className="z-50 grid w-full grid-cols-3 gap-x-3 gap-y-4 lg:grid-cols-4">
        {artPreferences?.map((pref, index) => (
          <button
            key={index}
            className="motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit rounded-md bg-black px-2 py-1 text-[16px] font-bold text-nowrap text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            onClick={() => handleSelection(pref)}
          >
            <p
              className={cn(
                "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
                isItemSelected(pref) && "text-neutral-700",
              )}
            >
              {pref}
            </p>
          </button>
        ))}
      </div>

      <NavbarButton
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        className="mt-[150px] flex w-full items-center justify-center self-center"
      >
        <button
          className="font-bebas group relative inline-flex w-full items-center justify-center gap-1 self-center rounded-lg bg-black px-2.5 py-1.5 text-[16px] font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={handlePersonalizeExp}
          disabled={isPending || selectedArt.length === 0}
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Spinner borderColor="border-white" />
            </div>
          ) : (
            <>
              Get Started{" "}
              <IconArrowRight width={20} height={20} className="button_icon" />
            </>
          )}
        </button>
      </NavbarButton>
    </section>
  );
};

export default ArtSelection;
