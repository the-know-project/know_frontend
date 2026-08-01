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
      }
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

  // Price adjustment functions
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
                <FormLabel className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Asset Value / Price
                </FormLabel>
                <FormControl>
                  <div
                    className="flex items-center rounded-2xl bg-neutral-100/70 p-1.5 border border-neutral-200/50 transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/80 focus-within:bg-white"
                  >
                    {/* Currency Selector integrated into the left side */}
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field: currencyField }) => (
                        <select
                          {...currencyField}
                          className="bg-transparent text-sm font-semibold text-neutral-700 py-2 pl-3 pr-2 focus:outline-none cursor-pointer border-r border-neutral-300/60 hover:text-blue-600 transition-colors"
                        >
                          <option value="NGN">NGN (₦)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      )}
                    />

                    {/* Numeric Input */}
                    <input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="w-full bg-transparent border-0 px-3 py-2 text-base font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-0 min-w-0"
                    />

                    {/* Stepper controls (Apple-style segmented design) */}
                    <div className="flex items-center rounded-xl bg-white border border-neutral-200/60 shadow-xs divide-x divide-neutral-200 overflow-hidden mr-1">
                      <button
                        type="button"
                        onClick={decrementPrice}
                        className="p-2 text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer flex items-center justify-center"
                        title="Decrement Price"
                      >
                        <IconMinus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={incrementPrice}
                        className="p-2 text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer flex items-center justify-center"
                        title="Increment Price"
                      >
                        <IconPlus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1 font-medium" />
              </FormItem>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full select-none cursor-pointer flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white py-3.5 px-4 font-semibold text-sm transition-all duration-300 shadow-sm shadow-blue-500/10"
        >
          {isSubmitting ? "Processing..." : "List Asset"}
        </button>
      </form>
    </Form>
  );
};
