import { PublicGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import GridBackground from "@/src/shared/components/grid-background";
import SelectRole from "@/src/shared/components/role-selection";

const Page = () => {
  return (
    <PublicGuard>
      <section className="flex w-full flex-col scroll-smooth">
        <GridBackground>
          <>
            <SelectRole />
          </>
        </GridBackground>
      </section>
    </PublicGuard>
  );
};

export default Page;
