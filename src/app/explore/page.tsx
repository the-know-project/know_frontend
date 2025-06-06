import { PageAuthGuard } from "@/src/features/auth/guards";
import ExploreCanvas from "@/src/features/explore/components/explore-canvas";
import ExploreCategories from "@/src/features/explore/components/explore-categories";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const Page = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery(getCategoriesQueryOptions);
  } catch (error) {
    return <p>Failed to load preferences: {(error as Error).message}</p>;
  }
  return (
    <PageAuthGuard requiresAuth>
      <section className="relative z-50 flex w-full flex-col px-6">
        <div className="mt-2 flex w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreCategories />
          </HydrationBoundary>
        </div>

        <div className="mt-[50px] flex w-full flex-col">
          <ExploreCanvas />
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
