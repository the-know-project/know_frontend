import GridBackground from "@/src/shared/components/grid-background";
import SetNewPasswordPage from "@/src/shared/components/newpassword";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <SetNewPasswordPage />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
