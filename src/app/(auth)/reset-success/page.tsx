import ResetSuccessPage from "@/src/features/auth/components/reset-success";
import GridBackground from "@/src/shared/components/grid-background";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <ResetSuccessPage />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
