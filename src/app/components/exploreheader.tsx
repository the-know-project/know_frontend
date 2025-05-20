// components/Header.tsx
"use client";
import { useState } from "react";
import { PiBellBold } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
      <div className="text-2xl font-bold text-primary">Know</div>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <IoSearchOutline  size={20} /> 
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-1 rounded-md focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-4">
        <button className="bg-primary text-white px-4 py-2 rounded-md">Share your work</button>
        {/* <Bell /> */}
        <PiBellBold />
        <FaUser />
      </div>
    </header>
  );
}
