import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-gray-200 p-4">
      <div className="flex flex-col items-center">
        <Image
          src="/placeholder-avatar.png"
          alt="avatar"
          width={20}
          height={20}
          className="mb-2 rounded-full"
        />
        <div className="text-center">
          <h2 className="text-lg font-bold">Hydon Precious</h2>
          <p className="text-sm text-gray-500">Artist</p>
          <p className="text-sm text-gray-500">📍 Nigeria</p>
          <button className="mt-2 rounded bg-blue-600 px-3 py-1 text-sm text-white">
            Edit profile information
          </button>
        </div>
        <div className="mt-4 w-full">
          <ul className="text-sm text-gray-600">
            <li className="flex justify-between border-b py-1">
              Post Views <span className="font-semibold">15M</span>
            </li>
            <li className="flex justify-between border-b py-1">
              Followers <span className="font-semibold">1.3K</span>
            </li>
            <li className="flex justify-between py-1">
              Following <span className="font-semibold">382</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
