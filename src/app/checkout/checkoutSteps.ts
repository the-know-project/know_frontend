// app/checkout/checkoutSteps.ts
export const checkoutSteps = [
    { label: 'Choose payment method', path: 'payment-method' },
    { label: 'Input payment details', path: 'card-details' },
    { label: 'Confirm Details', path: 'confirm' },
    { label: 'Shipping Info', path: 'shipping' },
  ];
  
  export type CheckoutStep = (typeof checkoutSteps)[number];
  