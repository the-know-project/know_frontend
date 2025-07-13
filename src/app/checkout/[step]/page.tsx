// app/checkout/[step]/page.tsx
import { notFound } from "next/navigation";
import { PaymentMethodForm } from "../components/PaymentMethodForm";
import { CardDetailsForm } from "../components/CardDetailsForm";
import { OrderConfirmation } from "../components/OrderConfirmation";
// import { ShippingInfo } from "../components/ShippingInfo";

const stepMap:any = {
  "payment-method": () => <PaymentMethodForm />,
  "card-details": () => <CardDetailsForm />,
  confirm: () => <OrderConfirmation />,
//   shipping: () => <ShippingInfo />,
};

export default function CheckoutStepPage({
  params,
}: {
  params: { step: string };
}) {
  const StepComponent = stepMap[params.step];

  if (!StepComponent) return notFound();

  return <StepComponent />;
}