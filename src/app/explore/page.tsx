import { PageGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import ExploreContainer from "@/src/features/explore/components/explore-container";

const Page = () => {
  return (
    <PageGuard>
      <section className="flex w-full flex-col px-6">
        <div className="mt-5 flex w-full flex-col gap-[50px]">
          <ExploreContainer enableServerSync={true} />
        </div>
      </section>
    </PageGuard>
  );
};

export default Page;
