// app/checkout/page.tsx
import { redirect } from "next/navigation";

export default function CheckoutHome() {
  redirect("/checkout/payment-method");
}
