import NewPasswordForm from "@/src/features/auth/components/new-password.form";
import GridBackground from "@/src/shared/components/grid-background";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <NewPasswordForm />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
