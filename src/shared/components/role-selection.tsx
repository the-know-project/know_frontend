"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleSelectionItems } from "@/src/constants/constants";
import { TitleText } from "../layout/header";
import { useRoleStore } from "@/src/features/auth/state/store/role.store";

export default function SelectRole() {
  const router = useRouter();
  const selectRole = useRoleStore((state) => state.setRole);

  const handleSelectRole = (selectedRole: string) => {
    if (selectedRole === "Artist") {
      selectRole("ARTIST");
    } else if (selectedRole === "Buyer") {
      selectRole("BUYER");
    }

    router.push("/signup");
  };

  return (
    <div className="relative z-50 grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center bg-transparent px-8 py-12 md:px-16">
        <div className="mb-10 flex items-center justify-between">
          <Image
            src="/Know-Logo.png"
            alt="Logo"
            width={60}
            height={60}
            quality={100}
          />
          <p className="font-bricolage text-sm font-medium text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        <div className="mb-8 flex max-w-prose flex-col gap-2">
          <TitleText textStyles={`w-full`}>
            <h1 className="font-helvetica text-3xl font-semibold text-black">
              Sign Up
            </h1>
          </TitleText>
          <p className="font-bricolage motion-preset-expand motion-duration-700 text-sm text-neutral-500">
            To get started, please select your primary role. You can switch
            between roles at any time in your profile.
          </p>
        </div>

        <div className="flex w-full flex-col space-y-4">
          {RoleSelectionItems.map((item) => (
            <div
              key={item.id}
              className={`flex w-full flex-col ${item.name === "Artist" ? "animated-purple-glow motion-preset-expand motion-duration-700" : "animated-yellow-glow motion-preset-expand motion-duration-700 motion-delay-700"}`}
            >
              <button
                onClick={() => handleSelectRole(item.name)}
                className={`flex w-full flex-row items-center gap-2 rounded-[15px] bg-transparent p-2 shadow-md hover:scale-105 active:scale-95`}
              >
                <div
                  className={`flex w-fit rounded-full p-2 ${item.name === "Artist" ? "bg-purple-600" : "bg-yellow-500"}`}
                >
                  {item.icon}
                </div>
                <div className="flex flex-col text-start">
                  <h3 className="font-helvetica text-lg font-medium text-black">
                    {item.name}
                  </h3>
                  <p className="font-bricolage text-sm text-neutral-500">
                    {item.content}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="motion-preset-blur-right-lg motion-duration-700 relative hidden md:block">
        <Image
          src="/roleselect.png"
          alt="role_selection_image"
          quality={100}
          fill
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
