import ResetFailedPage from "@/src/features/auth/components/reset-failed";
import GridBackground from "@/src/shared/components/grid-background";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <ResetFailedPage />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
