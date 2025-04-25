
import { FaBell, FaRegUser } from "react-icons/fa6";
import { useState } from "react";
import UserDropdown from "./userdropdown";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="h-6" />
        <input type="text" placeholder="Search" className="border rounded px-2 py-1 text-sm" />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">Share your work</button>
        <FaBell className="w-5 h-5 text-gray-600" />
        <div className="relative">
          <FaRegUser className="w-6 h-6 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)} />
          {dropdownOpen && <UserDropdown />}
        </div>
      </div>
    </header>
  );
}