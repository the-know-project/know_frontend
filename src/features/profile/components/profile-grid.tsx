"use client";
import { ArtistProfileToggle, posts } from "@/src/constants/constants";
import ProfileCard from "./profile-card";
import { useState } from "react";

export const ProfileGrid = () => {
  const [activeToggle, setActiveToggle] = useState<string>("posts");
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
              ? "left-0 w-1/4"
              : activeToggle === "stats"
                ? "left-1/4 w-1/4"
                : "left-[67%] w-[33%]"
          }`}
        ></div>
      </div>
      <div className="mt-1 grid grid-cols-2 gap-4 bg-white">
        {posts.map((post) => (
          <ProfileCard
            key={post.id}
            id={post.id}
            title={post.title}
            views={post.views}
            comments={post.comments}
            createdAt={post.createdAt}
            image={post.image}
          />
        ))}
      </div>
    </section>
  );
};
