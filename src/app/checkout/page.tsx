import { redirect } from "next/navigation";

export default function CheckoutHome() {
  redirect("/checkout/payment-method");
}
