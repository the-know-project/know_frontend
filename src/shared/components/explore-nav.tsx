// components/Header.tsx
"use client";
import { useState } from "react";
import { PiBellBold } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function ExploreNav() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
  };

  return (
    <header className="flex items-center justify-between border-b px-6 py-4 shadow-sm">
      <div className="text-primary text-2xl font-bold">Know</div>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <IoSearchOutline size={20} />
        <input
          type="text"
          placeholder="Search"
          className="rounded-md border px-3 py-1 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-4">
        <button className="bg-primary rounded-md px-4 py-2 text-white">
          Share your work
        </button>
        {/* <Bell /> */}
        <PiBellBold />
        <FaUser />
      </div>
    </header>
  );
}
