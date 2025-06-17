import { PageAuthGuard } from "@/src/features/auth/guards";
import ExploreContainer from "@/src/features/explore/components/explore-container";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";
import { getExploreAssetsQueryOptions } from "@/src/features/explore/queries/get-explore-assets.queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const PageEnhanced = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(getCategoriesQueryOptions);
    await queryClient.prefetchQuery(getExploreAssetsQueryOptions({}));

    // Optional: Prefetch common filter combinations for better UX
    // This helps with instant loading when users apply popular filters
    const commonFilterCombinations = [
      { sortBy: "latest" as const },
      { available: true },
      { priceMin: 50, priceMax: 500 },
      { sortBy: "latest" as const, available: true },
    ];

    await Promise.allSettled(
      commonFilterCombinations.map((filters) =>
        queryClient.prefetchQuery(getExploreAssetsQueryOptions(filters)),
      ),
    );

    // todo: Prefetch with popular categories leveraging analytics data
    // const popularCategories = ["Photography", "Digital Art", "Painting"];
    // await Promise.allSettled(
    //   popularCategories.map((category) =>
    //     queryClient.prefetchQuery(
    //       getExploreAssetsQueryOptions({ categories: [category] })
    //     )
    //   )
    // );
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  return (
    <PageAuthGuard requiresAuth>
      <section className="relative z-50 flex w-full flex-col px-6">
        <div className="mt-5 flex w-full flex-col gap-[50px]">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreContainer />
          </HydrationBoundary>
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default PageEnhanced;
