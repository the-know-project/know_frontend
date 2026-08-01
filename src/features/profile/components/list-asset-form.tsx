"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";

// Define form schema using zod
export const ListAssetSchema = z.object({
  currency: z.enum(["NGN", "USD"], {
    required_error: "Please select a currency",
  }),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Price must be a valid positive number",
      },
    ),
});

export type IListAssetFormValues = z.infer<typeof ListAssetSchema>;

interface ListAssetFormProps {
  onSubmit: (values: IListAssetFormValues) => void;
  isSubmitting?: boolean;
}

export const ListAssetForm: React.FC<ListAssetFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<IListAssetFormValues>({
    resolver: zodResolver(ListAssetSchema),
    defaultValues: {
      currency: "NGN",
      price: "",
    },
  });

  const { setValue, watch } = form;
  const currentPrice = watch("price");

  const incrementPrice = () => {
    const parsed = parseFloat(currentPrice);
    const newPrice = isNaN(parsed) ? 1 : Math.max(0, parsed + 1);
    setValue("price", newPrice.toString(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const decrementPrice = () => {
    const parsed = parseFloat(currentPrice);
    const newPrice = isNaN(parsed) ? 0 : Math.max(0, parsed - 1);
    setValue("price", newPrice.toString(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 font-sans text-neutral-800"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                {/*<FormLabel className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Asset Value / Price
                </FormLabel>*/}
                <FormControl>
                  <div className="flex items-center rounded-2xl border border-neutral-200/50 bg-neutral-100/70 p-1.5 transition-all duration-300 focus-within:border-[#1E3A8A]/80 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
                    {/* Currency Selector integrated into the left side */}
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field: currencyField }) => (
                        <select
                          {...currencyField}
                          className="font-grotesk cursor-pointer border-r border-neutral-300/60 bg-transparent py-2 pr-2 pl-3 text-sm font-semibold text-neutral-700 transition-colors hover:text-[#1E3A8A] focus:outline-none"
                        >
                          <option value="NGN">NGN</option>
                          <option value="USD">USD</option>
                        </select>
                      )}
                    />

                    {/* Numeric Input */}
                    <input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="font-grotesk placeholder:font-grotesk w-full min-w-0 border-0 bg-transparent px-3 py-2 text-base font-semibold text-neutral-800 placeholder:text-neutral-400 focus:ring-0 focus:outline-none"
                    />

                    {/* Stepper controls (Apple-style segmented design) */}
                    <div className="mr-1 flex items-center divide-x divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-xs">
                      <button
                        type="button"
                        onClick={decrementPrice}
                        className="flex cursor-pointer items-center justify-center p-2 text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-800 active:bg-neutral-100"
                        title="Decrement Price"
                      >
                        <IconMinus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={incrementPrice}
                        className="flex cursor-pointer items-center justify-center p-2 text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-800 active:bg-neutral-100"
                        title="Increment Price"
                      >
                        <IconPlus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="font-bebas mt-1 self-center text-xs font-medium tracking-wider text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-bebas flex w-full cursor-pointer items-center justify-center rounded-2xl bg-[#1E3A8A] px-4 py-3.5 text-sm font-semibold tracking-wider text-white shadow-sm shadow-blue-500/10 transition-all duration-300 select-none hover:bg-blue-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "List Asset"}
        </button>
      </form>
    </Form>
  );
};
