import GridBackground from "@/src/shared/components/grid-background";
import { GuestOnlyGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import ForgotPasswordForm from "@/src/features/auth/components/forgot-password-form";

const Page = () => {
  return (
    <GuestOnlyGuard>
      <section className="flex w-full flex-col scroll-smooth">
        <GridBackground>
          <>
            <ForgotPasswordForm />
          </>
        </GridBackground>
      </section>
    </GuestOnlyGuard>
  );
};

export default Page;
