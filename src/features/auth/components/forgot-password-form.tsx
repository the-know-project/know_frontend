"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { TitleText } from "@/src/shared/layout/header";
import { Input } from "@/src/shared/ui/input";
import { IconSend } from "@tabler/icons-react";
import { IForgotPassword, IForgotPasswordSuccess } from "../types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "../schema/auth.schema";
import { forgot_password } from "@/src/assets";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { toast } from "sonner";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { useRouter } from "next/navigation";
import Spinner from "@/src/shared/components/spinner";

const ForgotPasswordForm = () => {
  const router = useRouter()
  const { mutateAsync: handleForgotPassword, isPending } = useForgotPassword()

  const form = useForm<IForgotPassword>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleToast = (data: IForgotPasswordSuccess) => {
    if (data.status === 200) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: " oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
      router.push("/reset-password")
    } else if (data.status === 401) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    } else {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={`An error occurred`} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    }
  };

  const onSubmit = async (ctx: IForgotPassword) => {
    const res = await handleForgotPassword(ctx)
    handleToast(res)
  };
  return (
    <div className="relative z-50 grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col bg-transparent px-8 py-12 md:px-16">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/Know-Logo.png"
              alt="Logo"
              width={60}
              height={60}
              quality={100}
            />
          </Link>
          <p className="font-bricolage text-sm font-medium text-neutral-600">
            {" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Back to Log In
            </Link>
          </p>
        </div>

        <div className="mb-8 flex max-w-prose flex-col gap-2">
          <TitleText textStyles={`w-full`}>
            <h1 className="font-helvetica text-3xl font-semibold text-black capitalize">
              Forgot Password?
            </h1>
          </TitleText>
          <p className="font-bricolage motion-preset-expand motion-duration-700 text-sm text-neutral-500">
            A mail will be sent to your mail to reset your password
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Email */}
            <div className="relative flex w-full flex-col">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="signup_form_label">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="signup_form_input"
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>

                    <div className="absolute right-0 -bottom-5">
                      <FormMessage className="signup_error_message" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <button
                className="font-bebas text-md group relative mt-10 inline-flex h-9 w-full items-center justify-center gap-1 self-center rounded-lg bg-blue-500 px-2.5 py-1.5 font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-200"
                type="submit"
              >
                {isPending ? (
                  <div className="flex w-full items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                <div className="flex w-full items-center justify-center gap-2">
                  Send 6 Digit Code
                  <IconSend
                    width={20}
                    height={20}
                    color="white"
                    className="transiton-all -mt-1 duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>

      <div className="motion-preset-blur-right-lg motion-duration-700 relative hidden md:block">
        <Image
          src={forgot_password}
          alt="forgot_password"
          quality={100}
          fill
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
