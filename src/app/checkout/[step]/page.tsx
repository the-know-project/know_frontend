/**
 * @Developer: This implementation is throwing an error.
 * @Error: Type error: Type '{ params: { step: string; }; }' does not satisfy the constraint 'PageProps'.
   Types of property 'params' are incompatible.
     Type '{ step: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
  * @Dev: Ensure to always test your implementation

 */

// // app/checkout/[step]/page.tsx
// import { notFound } from "next/navigation";
// import { PaymentMethodForm } from "../components/PaymentMethodForm";
// import { CardDetailsForm } from "../components/CardDetailsForm";
// import { OrderConfirmation } from "../components/OrderConfirmation";
// // import { ShippingInfo } from "../components/ShippingInfo";

// const stepMap:any = {
//   "payment-method": () => <PaymentMethodForm />,
//   "card-details": () => <CardDetailsForm />,
//   confirm: () => <OrderConfirmation />,
// //   shipping: () => <ShippingInfo />,
// };

// export default function CheckoutStepPage({
//   params,
// }: {
//   params: { step: string };
// }) {
//   const StepComponent = stepMap[params.step];

//   if (!StepComponent) return notFound();

//   return <StepComponent />;
// }
