"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/src/shared/ui/input";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { IconSend } from "@tabler/icons-react";
import { useRef } from "react";

export default function VerifyCode() {
  const { register, handleSubmit, setValue } = useForm();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onSubmit = (data: any) => {
    const code = Object.values(data).join("");
    console.log("Verification code:", code);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // only digits

    setValue(`${index}`, value);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


 

  return (
    <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex flex-col px-8 py-12 md:px-16">
        {/* Logo and back link */}
        <div className="mb-10 flex items-center justify-between">
          <Image src="/Know-Logo.png" alt="Logo" width={60} height={60} />
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>

        {/* Title & description */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black">Password Reset</h1>
          <p className="text-sm text-neutral-600">
            We sent a code to <span className="text-blue-600 font-medium">preshj*****@gmail.com</span>
          </p>
        </div>

        {/* OTP Inputs */}
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-between gap-2 max-w-xs">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md transition-all duration-150 focus:outline-blue-500"
            {...register(`${i}`)}
            ref={(el:any) => (inputRefs.current[i] = el)}
            onChange={(e) => handleInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>

      <p className="text-xs text-center text-gray-500">
        Didn't get the mail?{" "}
        <button type="button" className="text-blue-600 hover:underline">
          Click to resend
        </button>
      </p>

       <Link  
       href="/new-password"
       >
        <button
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
        >
          Continue
          <IconSend width={20} height={20} color="white" />
        </button>
       </Link>
     
    </form>
      </div>

      {/* Right Image */}
      <div className="hidden md:block relative">
        <Image
          src="/roleselect.png" // Replace with actual image path
          alt="Background Art"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
