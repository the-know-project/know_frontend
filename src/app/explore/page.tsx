import { PageAuthGuard } from "@/src/features/auth/guards";
import ExploreCanvas from "@/src/features/explore/components/explore-canvas";
import ExploreCategories from "@/src/features/explore/components/explore-categories";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";
import { getExploreAssetsQueryOptions } from "@/src/features/explore/queries/get-explore-assets.queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const Page = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery(getCategoriesQueryOptions);
    await queryClient.prefetchQuery(getExploreAssetsQueryOptions({}));
  } catch (error) {
    return <p>Failed to load data: {(error as Error).message}</p>;
  }
  return (
    <PageAuthGuard requiresAuth>
      <section className="relative z-50 flex w-full flex-col px-6">
        <div className="mt-5 flex w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreCategories />
          </HydrationBoundary>
        </div>

        <div className="mt-[50px] flex w-full flex-col">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreCanvas />
          </HydrationBoundary>
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
