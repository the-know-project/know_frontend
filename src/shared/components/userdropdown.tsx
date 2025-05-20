export default function UserDropdown() {
    return (
      <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded shadow-lg border text-sm z-20">
        <div className="px-4 py-2 border-b">
          <p className="font-bold">Hydon Precious</p>
          <p className="text-gray-500 text-xs">hydonprecious@email.com</p>
          <button className="text-blue-600 text-xs mt-1">Upgrade to premium</button>
        </div>
        <ul className="divide-y">
          <li className="p-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Switch to Buyer</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Auctioned Works</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Payment Information</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Help</li>
          <li className="p-2 hover:bg-gray-100 text-red-600 cursor-pointer">Sign Out</li>
        </ul>
      </div>
    );
  }
  