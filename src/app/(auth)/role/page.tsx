import { PageAuthGuard } from "@/src/features/auth/guards";
import GridBackground from "@/src/shared/components/grid-background";
import SelectRole from "@/src/shared/components/role-selection";

const Page = () => {
  return (
    <PageAuthGuard guestOnly>
      <section className="flex w-full flex-col scroll-smooth">
        <GridBackground>
          <>
            <SelectRole />
          </>
        </GridBackground>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
