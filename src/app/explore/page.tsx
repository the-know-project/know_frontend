import { PageAuthGuard } from "@/src/features/auth/guards";
import ExploreContainer from "@/src/features/explore/components/explore-container";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";
import { getExploreAssetsQueryOptions } from "@/src/features/explore/queries/get-explore-assets.queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const Page = async () => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getCategoriesQueryOptions),
    queryClient.prefetchQuery(getExploreAssetsQueryOptions({})),
  ]);

  return (
    <PageAuthGuard requiresAuth>
      <section className="flex w-full flex-col px-6">
        <div className="mt-5 flex w-full flex-col gap-[50px]">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreContainer enableServerSync={true} />
          </HydrationBoundary>
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
