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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "../hooks";
import { useGoogleLogin } from "../hooks/use-google-login";
import { LoginSchema } from "../schema/auth.schema";
import { ILogin, ILoginSuccess } from "../types/auth.types";

const LoginForm = () => {
  const router = useRouter();
  const { mutateAsync: handleGoogleLogin, isPending: isGooglePending } =
    useGoogleLogin();
  const { mutateAsync: handleLogin, isPending } = useLogin();
  const [activeButton, setActiveButton] = useState<
    "regular" | "google" | "discord" | null
  >(null);
  const form = useForm<ILogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleToast = (data: ILoginSuccess) => {
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
      router.push("/explore");
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

  const onSubmit = async (ctx: ILogin) => {
    setActiveButton("regular");
    const data = await handleLogin(ctx);
    handleToast(data);
  };

  const handleGoogleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await handleGoogleLogin();
    handleToast(data);
  };

  const handleDiscordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveButton("discord");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setActiveButton(null);
  };

  return (
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
                    placeholder=""
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

        {/* Password */}
        <div className="relative flex w-full flex-col">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="signup_form_label">Password</FormLabel>
                <FormControl>
                  <Input
                    className="signup_form_input"
                    placeholder=""
                    type="password"
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

        {/* Create Account Button */}
        <NavbarButton
          colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
          className="flex w-full items-center justify-center"
        >
          <button
            className="font-bebas text-md group relative inline-flex h-9 w-full items-center justify-center gap-1 self-center rounded-lg bg-blue-500 px-2.5 py-1.5 font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-200"
            type="submit"
            disabled={isPending && activeButton === "regular"}
          >
            {isPending && activeButton === "regular" ? (
              <div className="flex w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center gap-2">
                Login
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

        {/* Sign Up With Google */}
        <button
          className="font-bebas text-md relative inline-flex h-9 w-full items-center justify-center gap-1 self-center rounded-lg bg-white px-2.5 py-1.5 font-medium text-nowrap text-neutral-900 capitalize shadow-sm outline outline-[#fff2f21f] transition-all duration-200 hover:scale-110 active:scale-95"
          type="button"
          onClick={handleGoogleSignup}
        >
          {isGooglePending ? (
            <div className="flex w-full items-center justify-center">
              <Spinner borderColor="border-yellow-500" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-2">
              Login With Google
              <Image
                src="/Google.png"
                alt="google"
                width={20}
                height={20}
                className="-mt-1 object-contain"
                quality={100}
                priority
              />
            </div>
          )}
        </button>

        {/* Sign Up With Discord Button */}
        <button
          className="font-bebas text-md relative inline-flex h-9 w-full items-center justify-center gap-1 self-center rounded-lg bg-white px-2.5 py-1.5 font-medium text-nowrap text-neutral-900 capitalize shadow-sm outline outline-[#fff2f21f] transition-all duration-200 hover:scale-110 active:scale-95"
          type="button"
          onClick={handleDiscordSignup}
          disabled={activeButton === "discord"}
        >
          {activeButton === "discord" ? (
            <div className="flex w-full items-center justify-center">
              <Spinner borderColor="border-purple-600" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-2">
              Login With Discord
              <Image
                src="/discord_symbol.png"
                alt="discord"
                width={20}
                height={20}
                className="-mt-1 object-contain"
                quality={100}
                priority
              />
            </div>
          )}
        </button>
      </form>
    </Form>
  );
};

export default LoginForm;
