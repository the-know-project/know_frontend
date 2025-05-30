"use client";

import Spinner from "@/src/shared/components/spinner";
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
import { useForm } from "react-hook-form";
import { SignUpFormSchema } from "../schema/auth.schema";
import { ISignUpForm } from "../types/auth.types";

const SignupForm = () => {
  const form = useForm<ISignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const isPending = false;

  const onSubmit = async (values: ISignUpForm) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* FirstName & LastName */}
        <div className="flex flex-row items-center justify-between gap-5">
          <div className="relative flex w-fit flex-col">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="signup_form_label">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="signup_form_input !important"
                      placeholder="First Name"
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

          <div className="relative flex w-fit flex-col">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="signup_form_label">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="signup_form_input !important"
                      placeholder="Last Name"
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
        </div>

        {/* Username & Email */}
        <div className="flex flex-row items-center justify-between gap-5">
          <div className="relative flex w-fit flex-col">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="signup_form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="signup_form_input"
                      placeholder="Email"
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

          <div className="relative flex w-fit flex-col">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="signup_form_label">User Name</FormLabel>
                  <FormControl>
                    <Input
                      className="signup_form_input"
                      placeholder="Username"
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
                    placeholder="Password"
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
          >
            {isPending ? (
              <div className="flex w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center gap-2">
                Create Account
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
          type="submit"
        >
          {isPending ? (
            <div className="flex w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-2">
              Sign Up With Google
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
          type="submit"
        >
          {isPending ? (
            <div className="flex w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-2">
              Sign Up With Discord
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

export default SignupForm;
