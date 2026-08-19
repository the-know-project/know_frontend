"use client";

import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { useFetchShippingInfo } from "@/src/features/shipping/hooks/use-fetch-shipping-info";
import { useCreateShippingInfo } from "@/src/features/shipping/hooks/use-create-shipping-info";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { logger } from "@/src/utils/logger";

const DeliveryMethodSchema = z.enum(["delivery", "pickup"]);
type DeliveryType = z.infer<typeof DeliveryMethodSchema>;

const ShippingSchema = z.object({
  deliveryMethod: DeliveryMethodSchema,
  phone: z.string().min(5, "Phone number is too short"),
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP Code is required"),
  houseAddress: z.string().min(1, "House address is required"),
  landmark: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof ShippingSchema>;

export function ShippingInfo() {
  const { data: shippingInfo, isLoading } = useFetchShippingInfo();
  const { mutateAsync: updateShippingInfo } = useCreateShippingInfo();
  const router = useRouter();

  const shippingInfoData = shippingInfo?.data;
  logger.debug("Shipping Info Data:", shippingInfoData);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      deliveryMethod:
        (shippingInfoData?.deliveryMethod as DeliveryType) || "delivery",
      phone: shippingInfoData?.phoneNumber || "",
      country: shippingInfoData?.country || "",
      city: shippingInfoData?.city || "",
      state: shippingInfoData?.state || "",
      zip: shippingInfoData?.postalCode || "",
      houseAddress: shippingInfoData?.address || "",
      landmark: shippingInfoData?.landmark || "",
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");

  const onSubmit = async (values: ShippingFormValues) => {
    console.log("Shipping Info Submitted:", values);
    const shippingToastId = toast.loading(`Saving shipping information`, {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });

    const result = await updateShippingInfo({
      deliveryMethod: values.deliveryMethod,
      country: values.country,
      phoneNumber: values.phone,
      city: values.city,
      state: values.state,
      postalCode: values.zip,
      address: values.houseAddress,
      landmark: values.landmark,
    });

    if (result.status === 200 || result.status === 201) {
      toast.success(`Shipping information saved`, {
        id: shippingToastId,
        icon: <ToastIcon />,
        description: <ToastDescription description={result.message} />,
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

      router.push("/checkout/confirm");
    } else {
      toast.error(`Failed to save shipping information`, {
        id: shippingToastId,
        icon: <ToastIcon />,
        description: <ToastDescription description={result.message} />,
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

  return (
    <div className="mx-auto w-full max-w-xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-8 md:px-0">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="font-helvetica text-base font-semibold text-neutral-900 capitalize sm:text-lg">
          Shipping Information
        </h2>
        <p className="font-grotesk text-xs text-neutral-600 sm:text-sm">
          Enter the correct details to ensure successful delivery to this
          address.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-4 md:space-y-5"
        >
          {/* Delivery Method Toggle */}
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => form.setValue("deliveryMethod", "delivery")}
              className={`font-bebas flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 tracking-wider transition-colors active:scale-95 sm:gap-1.5 sm:px-3 sm:py-2.5 md:gap-2 md:px-4 md:py-3 ${
                deliveryMethod === "delivery"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                  deliveryMethod === "delivery"
                    ? "border-orange-500"
                    : "border-gray-400"
                }`}
              >
                {deliveryMethod === "delivery" && (
                  <div className="h-[10px] w-[10px] rounded-full bg-orange-500 sm:h-2 sm:w-2 md:h-3 md:w-3" />
                )}
              </div>
              <svg
                className="h-[14px] w-[14px] flex-shrink-0 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span className="text-[11px] font-medium sm:text-xs md:text-sm">
                Delivery
              </span>
            </button>

            <button
              type="button"
              onClick={() => form.setValue("deliveryMethod", "pickup")}
              className={`font-bebas flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 tracking-wider transition-colors active:scale-95 sm:gap-1.5 sm:px-3 sm:py-2.5 md:gap-2 md:px-4 md:py-3 ${
                deliveryMethod === "pickup"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                  deliveryMethod === "pickup"
                    ? "border-orange-500"
                    : "border-gray-400"
                }`}
              >
                {deliveryMethod === "pickup" && (
                  <div className="h-[10px] w-[10px] rounded-full bg-orange-500 sm:h-2 sm:w-2 md:h-3 md:w-3" />
                )}
              </div>
              <svg
                className="h-[14px] w-[14px] flex-shrink-0 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-[11px] font-medium sm:text-xs md:text-sm">
                Pickup
              </span>
            </button>
          </div>

          {/* Full Name & Email */}
          {/*<div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 md:gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex flex-col relative w-full">
                  <FormLabel className="signup_form_label">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex flex-col relative w-full">
                  <FormLabel className="signup_form_label">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />
          </div>*/}

          {/* Phone Number & Country */}
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 md:gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col space-y-1.5">
                  <FormLabel className="signup_form_label">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col space-y-1.5">
                  <FormLabel className="signup_form_label">Country</FormLabel>
                  <FormControl>
                    <select
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring font-grotesk flex h-11 w-full rounded-md border px-3 py-2 text-sm text-[13px] font-medium text-neutral-600 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-sm md:h-11 md:text-base"
                      {...field}
                    >
                      <option value="" className="signup_form_input">
                        Select country
                      </option>
                      <option value="NG">Nigeria</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />
          </div>

          {/* City, State & ZIP Code */}
          <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 md:gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col space-y-1.5">
                  <FormLabel className="signup_form_label">City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col space-y-1.5">
                  <FormLabel className="signup_form_label">State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter state"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col space-y-1.5">
                  <FormLabel className="signup_form_label">ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ZIP"
                      className="signup_form_input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="signup_error_message" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="houseAddress"
            render={({ field }) => (
              <FormItem className="relative flex w-full flex-col space-y-1.5">
                <FormLabel className="signup_form_label">
                  House Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter house address"
                    className="signup_form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="signup_error_message" />
              </FormItem>
            )}
          />

          {/* Landmark */}
          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem className="relative flex w-full flex-col space-y-1.5">
                <FormLabel className="signup_form_label">Landmark</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter nearby landmark"
                    className="signup_form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="signup_error_message" />
              </FormItem>
            )}
          />

          {/* Make Payment Button */}
          <div className="pt-2 sm:pt-3 md:pt-4">
            <Button
              type="submit"
              className="font-bebas min-h-[48px] w-full bg-[#1E3A8A] text-[14px] font-semibold tracking-wider text-white transition-transform hover:bg-[#1a3474] active:scale-98 sm:min-h-[44px] sm:text-sm md:min-h-[48px] md:text-base"
            >
              Make payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
