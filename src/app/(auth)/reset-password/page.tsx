import VerifyCode from "@/src/features/auth/components/reset-password";
import GridBackground from "@/src/shared/components/grid-background";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <VerifyCode />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
