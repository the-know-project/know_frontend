"use client";

import OtpForm from "@/src/features/auth/components/otp-form";
import { PageAuthGuard } from "@/src/features/auth/guards";
import { TitleText } from "@/src/shared/layout/header";
import Image from "next/image";
import Link from "next/link";

const OtpVerification = () => {
  return (
    <PageAuthGuard guestOnly={false}>
      <section className="relative z-50 flex w-full flex-col">
        <div className="flex items-center justify-between">
          <Image
            src="/Know-Logo.png"
            alt="Logo"
            width={60}
            height={60}
            quality={100}
          />
          <p className="font-bricolage text-sm font-medium text-neutral-600">
            Didn't receive code?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Resend OTP
            </Link>
          </p>
        </div>

        <div className="mt-5 flex w-full flex-col">
          <TitleText textStyles={`w-full`}>
            <h1 className="title_text">Verify Your Email</h1>
          </TitleText>
          <div className="motion-preset-expand motion-duration-700 mt-10 flex max-w-full flex-col">
            <OtpForm />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>We've sent a 6-digit verification code to your email</p>
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default OtpVerification;