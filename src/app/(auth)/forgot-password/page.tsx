import GridBackground from "@/src/shared/components/grid-background";
import { PageAuthGuard } from "@/src/features/auth/guards";
import ForgotPasswordForm from "@/src/features/auth/components/forgot-password-form";

const Page = () => {
  return (
    <PageAuthGuard guestOnly>
      <section className="flex w-full flex-col scroll-smooth">
        <GridBackground>
          <>
            <ForgotPasswordForm />
          </>
        </GridBackground>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
