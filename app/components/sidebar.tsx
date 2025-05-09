import Image from "next/image";


export default function Sidebar() {
    return (
      <aside className="w-72 p-4 border-r bg-white text-black border-gray-200">
        <div className="flex flex-col items-center">
          <img src="/Avatar.png" alt="avatar" className="w-20 h-20 rounded-full mb-2" />
          <div className="text-center">
            <h2 className="text-lg font-bold">Hydon Precious</h2>
            <p className="text-sm text-gray-500">Artist</p>
            <p className="text-sm text-gray-500">📍 Nigeria</p>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit profile information</button>
          </div>
          <div className="mt-4 w-full">
            <ul className="text-sm text-gray-600">
              <li className="flex justify-between py-1 border-b">Post Views <span className="font-semibold">15M</span></li>
              <li className="flex justify-between py-1 border-b">Followers <span className="font-semibold">1.3K</span></li>
              <li className="flex justify-between py-1">Following <span className="font-semibold">382</span></li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }