// app/checkout/card-details/page.tsx
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import { CardDetailsForm } from "../components/CardDetailsForm";

export default function CardDetailsPage() {
  return (
    <EnhancedAuthProvider
      enableAutoRefresh={true}
      refreshThresholdMinutes={20}
      checkInterval={1600000}
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <CardDetailsForm />
    </EnhancedAuthProvider>
  );
}
