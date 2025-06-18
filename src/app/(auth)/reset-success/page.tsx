import GridBackground from "@/src/shared/components/grid-background";
import ResetSuccessPage from "@/src/shared/components/resetsuccess";

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
