"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconSend } from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import {
  EmailSchema,
  IAddToMailList,
} from "@/src/features/mail-list/schemas/email.schema";
import { useAddToMailList } from "@/src/features/mail-list/hooks/use-add-to-mail-list";
import Spinner from "@/src/shared/components/spinner";

const JoinCtaForm = () => {
  const { mutateAsync: addToMailList, isPending } = useAddToMailList();
  const form = useForm<IAddToMailList>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleCtaAction = async (ctx: IAddToMailList) => {
    const data = await addToMailList(ctx);
    console.log(data);
  };
  return (
    <section className="flex w-full flex-row items-center justify-start sm:justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCtaAction)}
          className="relative flex flex-row items-center gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="font-bricolage placeholder:font-bebas !important placeholder:text-md flex w-full rounded-lg bg-neutral-100 text-neutral-700 shadow-sm placeholder:text-neutral-700 focus-visible:shadow-none focus-visible:ring-0 sm:placeholder:text-sm md:min-w-[400px]"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>

                <div className="absolute left-3">
                  <FormMessage className="font-bebas tracking-widest" />
                </div>
              </FormItem>
            )}
          />
          <NavbarButton
            colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            className="flex w-fit"
          >
            <button
              className="font-bebas text-md group relative inline-flex h-9 w-fit items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1.5 font-medium text-nowrap text-white capitalize outline outline-[#fff2f21f] transition-all duration-200"
              type="submit"
            >
              {isPending ? (
                <Spinner />
              ) : (
                <div className="flex h-fit w-fit flex-row flex-nowrap items-center gap-1">
                  Get Started
                  <IconSend
                    width={20}
                    height={20}
                    color="white"
                    className="transiton-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              )}
            </button>
          </NavbarButton>
        </form>
      </Form>
    </section>
  );
};

export default JoinCtaForm;
