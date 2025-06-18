"use client";

import { IconSend } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useForm } from "react-hook-form";

const VerifyCode = () => {
  const { register, handleSubmit, setValue } = useForm();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onSubmit = (data: any) => {
    const code = Object.values(data).join("");
    console.log("Verification code:", code);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
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
    index: number,
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
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Back to Login
          </Link>
        </div>

        {/* Title & description */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black">Password Reset</h1>
          <p className="text-sm text-neutral-600">
            We sent a code to{" "}
            <span className="font-medium text-blue-600">
              preshj*****@gmail.com
            </span>
          </p>
        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex max-w-xs justify-between gap-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg transition-all duration-150 focus:outline-blue-500"
                {...register(`${i}`)}
                ref={(el: any) => (inputRefs.current[i] = el)}
                onChange={(e) => handleInputChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-500">
            Didn't get the mail?{" "}
            <button type="button" className="text-blue-600 hover:underline">
              Click to resend
            </button>
          </p>

          <Link href="/new-password">
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Continue
              <IconSend width={20} height={20} color="white" />
            </button>
          </Link>
        </form>
      </div>

      {/* Right Image */}
      <div className="relative hidden md:block">
        <Image
          src="/roleselect.png" // Replace with actual image path
          alt="Background Art"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default VerifyCode;
