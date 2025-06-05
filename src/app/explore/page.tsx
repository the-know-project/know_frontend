import { PageAuthGuard } from "@/src/features/auth/guards";
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
      <section className="relative z-50 flex w-full px-6">
        <div className="mt-2 flex w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreCategories />
          </HydrationBoundary>
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
