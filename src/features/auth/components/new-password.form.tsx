"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "../schema/auth.schema";
import { IResetPassword } from "../types/auth.types";

const NewPasswordForm = () => {
  const form = useForm<IResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (ctx: IResetPassword) => {
    console.log("Resetting password to:", ctx.password);
  };

  return (
    <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left Form Side */}
      <div className="flex flex-col px-8 py-12 md:px-16">
        {/* Logo and Back link */}
        <div className="mb-10 flex items-center justify-between">
          <Image src="/Know-Logo.png" alt="Logo" width={60} height={60} />
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8 max-w-sm">
          <h1 className="text-2xl font-semibold text-black">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Must be at least 8 characters
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm space-y-6"
          >
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Link href="/reset-success">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Reset password
              </button>
            </Link>
          </form>
        </Form>
      </div>

      {/* Right Image */}
      <div className="relative hidden md:block">
        <Image
          src="/roleselect.png"
          alt="reset-password-image"
          quality={100}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default NewPasswordForm;
