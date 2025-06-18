import GridBackground from "@/src/shared/components/grid-background";
import VerifyCode from "@/src/shared/components/resetpassword";

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
