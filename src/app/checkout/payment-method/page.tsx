// app/checkout/payment-method/page.tsx
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import { PaymentMethodForm } from "../components/PaymentMethodForm";

export default function PaymentMethodPage() {
  return (
    <EnhancedAuthProvider
      enableAutoRefresh={true}
      refreshThresholdMinutes={20}
      checkInterval={1600000}
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <PaymentMethodForm />
    </EnhancedAuthProvider>
  );
}
