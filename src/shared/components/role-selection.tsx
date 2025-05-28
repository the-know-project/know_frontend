"use client";

import Image from "next/image";
import { LuUserRound } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectRole() {
  const router = useRouter();

  const handleSelectRole = (selectedRole: string) => {
    console.log(selectedRole);
    router.push("/auth/signup");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center bg-white px-8 py-12 md:px-16">
        <div className="mb-10 flex items-center justify-between">
          <Image src="/Know-Logo.png" alt="Logo" width={60} height={60} />
          <p className="text-sm text-neutral-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a>
          </p>
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-black">Sign Up</h1>
        <p className="mb-8 text-sm text-neutral-500">
          To get started, please select your primary role. You can switch
          between roles at any time in your profile.
        </p>

        <div className="space-y-4">
          <Link href={"/auth/signup"}>
            <button
              onClick={() => handleSelectRole("ARTIST")}
              className="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-b-neutral-300 p-4"
            >
              <div className="flex h-[20px] w-[20px] items-center justify-center rounded-[24px] bg-gray-400/35 md:h-[52px] md:w-[52px]">
                <LuUserRound className="mt-1 text-2xl text-neutral-700 md:text-3xl" />
              </div>

              <div className="text-left">
                <p className="text-lg font-medium text-black">Artist</p>
                <p className="text-sm text-neutral-500">
                  Showcase your art to a global audience and expand your reach.
                </p>
              </div>
            </button>
          </Link>

          <button
            onClick={() => handleSelectRole("BUYER")}
            className="flex w-full cursor-pointer items-start gap-3 rounded-lg p-4 transition hover:border-black"
          >
            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-[24px] bg-gray-400/35 md:h-[52px] md:w-[52px]">
              <LuUserRound className="mt-1 text-2xl text-neutral-700 md:text-3xl" />
            </div>
            <div className="text-left">
              <p className="text-lg font-medium text-black">Buyer</p>
              <p className="text-sm text-neutral-500">
                Discover unique artworks, connect with artists, and build your
                collection.
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="relative hidden md:block">
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
