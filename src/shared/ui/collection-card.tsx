"use client";

import { formatDateToReadable } from "@/src/utils/date";
import { Settings2Icon } from "lucide-react";
import { motion } from "motion/react";

type ICollectionCard = {
  id: string | number;
  firstName: string;
  lastName: string;
  title: string;
  src: string;
  numOfArt: number;
};

const date = new Date(Date.now()).toISOString();

const CollectionCard: React.FC<ICollectionCard> = ({
  title,
  src,
  firstName,
  lastName,
  numOfArt,
}) => {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-md">
      <div className="relative h-80 w-[300px] overflow-visible">
        {/* Back Card Stack: Far */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(236,72,153,0.35))",
            filter: "blur(7px)",
            transformOrigin: "center",
          }}
          animate={{
            scale: 0.95,
            y: -30,
            rotate: -40,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
        />

        {/* Back Card Stack: Near */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.45)",
            filter: "blur(7px)",
            transformOrigin: "center",
          }}
          animate={{
            scale: 0.98,
            y: -30,
            rotate: 30,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 22,
          }}
        />

        {/* MAIN IMAGE CARD (STRAIGHT) */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 24,
          }}
        >
          <img
            src={src}
            alt={title}
            draggable={false}
            className="h-[300px] w-[400px] object-cover"
          />
        </motion.div>
        <div className="absolute top-2 left-2 z-30 rounded-3xl bg-transparent p-2 shadow-lg backdrop-blur-2xl">
          <Settings2Icon width={24} height={25} className="text-white" />
        </div>

        <div className="absolute top-2 right-2 z-30 rounded-3xl bg-transparent p-2 shadow-lg backdrop-blur-2xl">
          <p className="font-bebas flex self-center text-center font-bold tracking-wider text-white">
            {numOfArt}
          </p>
        </div>

        <div className="group absolute bottom-7 z-30 w-full max-w-sm self-center rounded-3xl px-4 py-2 shadow-lg backdrop-blur-2xl md:max-w-md">
          <div className="flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95">
            <p className="font-bebas flex self-center text-center font-bold tracking-wider text-white">
              View Collection
            </p>
          </div>
        </div>
      </div>

      {/* TEXT */}
      <div className="mt-2">
        <h3 className="font-bricolage sm:text-normal text-sm font-bold text-neutral-900 capitalize">
          {title}
        </h3>
        <p className="font-bricolage text-xs font-light text-[#666666] capitalize sm:text-sm">
          {formatDateToReadable(date)}
        </p>
      </div>
    </div>
  );
};

export default CollectionCard;
