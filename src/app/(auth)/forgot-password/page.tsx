import GridBackground from "@/src/shared/components/grid-background";
import ForgotPassword from "@/src/shared/components/forgotpassword";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <ForgotPassword />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
