"use client";
import { ArrowDown, Coins } from "lucide-react";
import ArtistChart from "./artist-chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/ui/popover";
import { FaCaretDown } from "react-icons/fa6";
import { useState } from "react";

const ArtistSalesStats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Monthly");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  return (
    <section className="flex w-full flex-col overflow-x-hidden py-14">
      <div className="mb-6 flex items-center gap-8">
        <div className="rounded-full bg-orange-100 p-2">
          <Coins className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="stats_title">Earnings</h2>
        </div>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger>
            <div className="stats_content flex items-center gap-1 rounded-[15px] border border-gray-300 px-4 py-1">
              <p
                key={selectedPeriod}
                className="motion-preset-expand motion-duration-300"
              >
                {selectedPeriod}
              </p>

              <FaCaretDown
                className={`ml-2 h-4 w-4 text-[#666666] transition-transform duration-200 ${isPopoverOpen ? "rotate-180" : ""}`}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex w-fit flex-col items-center gap-2 px-4 py-2">
            <p
              className="stats_content !text-[14px] transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => {
                setSelectedPeriod("Monthly");
                setIsPopoverOpen(false);
              }}
            >
              Monthly
            </p>
            <p
              className="stats_content !text-[14px] transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => {
                setSelectedPeriod("Yearly");
                setIsPopoverOpen(false);
              }}
            >
              Yearly
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex w-full flex-col">
        <ArtistChart />
      </div>
    </section>
  );
};

export default ArtistSalesStats;
