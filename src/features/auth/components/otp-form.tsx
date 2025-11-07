"use client";

import Spinner from "@/src/shared/components/spinner";
import ToastDescription from "@/src/shared/components/toast-description";
import ToastIcon from "@/src/shared/components/toast-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconSend } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useValidateOtp } from "../hooks/use-validate-otp";
import { IOtpForm, ISignUpForm } from "../types/auth.types";
import { OtpFormSchema } from "../schema/auth.schema";
import { useSignUp } from "../hooks/use-sign-up";
import { decryptData } from "@/src/utils/crypto";
import { useSendOtp } from "../hooks/use-send-otp";
import { useState } from "react";

const OtpForm = () => {
  const { mutateAsync: handleValidateOtp, isPending } = useValidateOtp();
  const { mutateAsync: handleSendOtp } = useSendOtp();
  const { mutateAsync: handleSignUp } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<IOtpForm>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleToast = (success: boolean, message: string) => {
    toast("", {
      icon: <ToastIcon />,
      description: <ToastDescription description={message} />,
      style: {
        backdropFilter: "-moz-initial",
        opacity: "-moz-initial",
        backgroundColor: success
          ? "oklch(62.7% 0.194 149.214)"
          : "oklch(62.8% 0.258 29.234)",
        fontSize: "15px",
        font: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "bolder",
      },
    });
  };

  const onSubmit = async (data: IOtpForm) => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    // Step 1: Validate OTP
    console.log("Step 1: Validating OTP...");
    const result = await handleValidateOtp(data);

    if (result.status !== 200) {
      handleToast(false, result.message || "Invalid OTP. Please try again.");
      setIsProcessing(false);
      return;
    }

    console.log("✅ OTP validated successfully");
    handleToast(true, result.message);

    // Step 2: Retrieve sign-up data from session
    const ctxData = sessionStorage.getItem("sign-up");

    if (!ctxData) {
      handleToast(false, "Session expired. Please start registration again.");
      setIsProcessing(false);
      setTimeout(() => router.push("/signup"), 2000);
      return;
    }

    // Step 3: Decrypt and sanitize signup data
    console.log("🔐 Decrypting signup data...");
    const decrypted = await decryptData(ctxData);
    const ctx = JSON.parse(decrypted);

    console.log("Decrypted signup data:", ctx);

    // ✅ Sanitize: convert null/undefined → "", force all values to strings
    const sanitizedCtx = Object.fromEntries(
      Object.entries(ctx).map(([key, value]) => [
        key,
        value === null || value === undefined ? "" : String(value),
      ])
    );

    console.log("Sanitized signup data:", sanitizedCtx);

    // Step 4: Attempt registration
    console.log("Attempting registration...");
    const signUpData = await handleSignUp(sanitizedCtx as ISignUpForm);

    console.log("Registration successful");
    handleToast(true, signUpData.message || "Registration successful!");

    // Clear session storage and redirect
    sessionStorage.removeItem("sign-up");
    setTimeout(() => router.push("/login"), 1500);

  } catch (signUpError: any) {
    console.error("Registration error:", signUpError);

    const errorData = signUpError?.response?.data;
    const errorMessage =
      errorData?.message ||
      signUpError?.message ||
      "Registration failed";

    const isDuplicateError =
      errorMessage.toLowerCase().includes("duplicate") ||
      errorMessage.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("unique constraint") ||
      errorMessage.toLowerCase().includes("email_unique") ||
      errorData?.statusCode === 409;

    if (isDuplicateError) {
      console.log("⚠️ Duplicate email detected - treating as success");
      handleToast(true, "Your account has been created! Redirecting to login...");
      sessionStorage.removeItem("sign-up");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      handleToast(false, errorMessage);
      setIsProcessing(false);
    }
  }
};


  const handleResendOTP = async () => {
    try {
      const ctxData = sessionStorage.getItem("sign-up");

      if (!ctxData) {
        handleToast(false, "Session expired. Please start registration again.");
        setTimeout(() => router.push("/signup"), 2000);
        return;
      }

      const ctx = JSON.parse(await decryptData(ctxData));
      const data = await handleSendOtp(ctx);
      handleToast(true, data.message || "OTP sent successfully!");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP";
      handleToast(false, errorMessage);
    }
  };

  // Handle input change to auto-focus next field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const currentOtp = form.getValues("otp") || "";
    let newOtp = currentOtp.split("");

    if (value.length > 1) {
      const pastedValue = value.replace(/\D/g, "").substring(0, 6);
      form.setValue("otp", pastedValue);
      const lastInput = document.getElementById(
        `otp-${pastedValue.length - 1}`
      );
      if (lastInput) lastInput.focus();
      return;
    }

    newOtp[index] = value;
    form.setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* OTP Input Fields */}
        <div className="relative flex w-full flex-col">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="signup_form_label">6-Digit OTP</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(6)].map((_, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        className="otp_input text-center"
                        maxLength={1}
                        value={field.value?.[index] || ""}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus={index === 0}
                        disabled={isProcessing}
                      />
                    ))}
                  </div>
                </FormControl>

                <div className="absolute right-0 -bottom-5">
                  <FormMessage className="signup_error_message" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Verify Button */}
        <NavbarButton
          colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
          className="flex w-full items-center justify-center"
        >
          <button
            className="font-bebas text-md group relative inline-flex h-9 w-full items-center justify-center gap-1 self-center rounded-lg bg-blue-500 px-2.5 py-1.5 font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending || isProcessing}
          >
            {isPending || isProcessing ? (
              <div className="flex w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center gap-2">
                Verify OTP
                <IconSend
                  width={20}
                  height={20}
                  color="white"
                  className="transiton-all -mt-1 duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            )}
          </button>
        </NavbarButton>

        {/* Resend OTP Link */}
        <div className="flex justify-center">
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResendOTP}
            disabled={isProcessing}
          >
            Resend OTP
          </button>
        </div>
      </form>
    </Form>
  );
};

export default OtpForm;
