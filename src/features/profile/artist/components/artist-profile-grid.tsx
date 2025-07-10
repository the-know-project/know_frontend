"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { posts, ArtistProfileToggle } from "@/src/constants/constants";
import ProfileCard from "../../components/profile-card";

const ArtistProfileGrid = () => {
  const [activeToggle, setActiveToggle] = useState<string>("posts");

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <section className="flex w-full flex-col">
      <div className="relative flex flex-row items-center justify-between">
        {ArtistProfileToggle.map((toggle) => (
          <button
            key={toggle.id}
            className="flex flex-1 flex-col items-start"
            onClick={() => setActiveToggle(toggle.name)}
          >
            <p
              className={`font-bricolage capitalize hover:scale-105 active:scale-95 ${
                activeToggle === toggle.name
                  ? "font-semibold text-black transition-colors duration-300"
                  : "text-neutral-500"
              }`}
            >
              {toggle.name}
            </p>
          </button>
        ))}
        {/* Continuous line background */}
        <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-gray-300"></div>
        {/* Active section highlight */}
        <div
          className={`absolute bottom-0 h-[2px] bg-black transition-all duration-300 ${
            activeToggle === "posts"
              ? "left-0 w-1/4 rounded-[15px]"
              : activeToggle === "stats"
                ? "left-1/4 w-1/4 rounded-[15px]"
                : "left-[67%] w-[33%] rounded-[15px]"
          }`}
        ></div>
      </div>
      <div className="mt-1 grid grid-cols-2 gap-4 bg-white">
        {activeToggle === "posts" && (
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  delay: 0.05,
                  ease: "easeInOut",
                  duration: 0.09,
                }}
              >
                <ProfileCard
                  id={post.id}
                  title={post.title}
                  views={post.views}
                  createdAt={post.createdAt}
                  image={post.image}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default ArtistProfileGrid;
