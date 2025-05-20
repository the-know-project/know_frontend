import Image from "next/image";
import { LuUserRound } from "react-icons/lu";
import Link from "next/link";

export default function SelectRole() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-white">
        
        <div className="flex justify-between items-center mb-10">
          <Image src="/Know-Logo.png" alt="Logo" width={60} height={60} />
          <p className="text-sm text-neutral-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">Log In</a>
          </p>
        </div>

        <h1 className="text-3xl text-black font-semibold mb-2">Sign Up</h1>
        <p className="text-sm text-neutral-500 mb-8">
          To get started, please select your primary role. You can switch between roles at any time in your profile.
        </p>

        
        <div className="space-y-4">
          <Link href={"/auth/signup"}>
          <button className="w-full cursor-pointer border border-b-neutral-300 p-4 rounded-lg flex items-start gap-3">
            <div className="h-[20px]  md:h-[52px] md:w-[52px] w-[20px] flex items-center justify-center  rounded-[24px] bg-gray-400/35">
            <LuUserRound  className="mt-1 text-2xl  md:text-3xl text-neutral-700" />
            </div>
            
            <div className="text-left">
              <p className="font-medium text-black text-lg">Artist</p>
              <p className="text-sm text-neutral-500">
                Showcase your art to a global audience and expand your reach.
              </p>
            </div>
          </button>
          </Link>
          

          <button className="w-full cursor-pointer p-4 rounded-lg flex items-start gap-3 hover:border-black transition">
           <div className="h-[20px] md:h-[52px] w-[20px] md:w-[52px] flex items-center justify-center  rounded-[24px] bg-gray-400/35">
            <LuUserRound  className="mt-1 text-2xl  md:text-3xl text-neutral-700" />

           </div>
            <div className="text-left">
              <p className="font-medium text-black text-lg">Buyer</p>
              <p className="text-sm text-neutral-500">
                Discover unique artworks, connect with artists, and build your collection.
              </p>
            </div>
          </button>
        </div>
      </div>

    
      <div className="hidden md:block relative">
        <Image
          src="/roleselect.png" 
          alt="Signup Visual"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
