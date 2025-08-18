import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import ExploreContainer from "@/src/features/explore/components/explore-container";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";
import { getExploreAssetsQueryOptions } from "@/src/features/explore/queries/get-explore-assets.queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { TFetchExploreAsset } from "@/src/features/explore/types/explore.types";

interface PageProps {
  searchParams: {
    categories?: string;
    sortBy?: "latest" | "oldest";
    available?: string;
    priceMin?: string;
    priceMax?: string;
    page?: string;
    limit?: string;
  };
}

const parseSearchParams = (
  searchParams: PageProps["searchParams"],
): TFetchExploreAsset => {
  const params: TFetchExploreAsset = {};

  // Parse categories (comma-separated)
  if (searchParams.categories) {
    params.categories = searchParams.categories
      .split(",")
      .map((cat) => decodeURIComponent(cat.trim()));
  }

  // Parse sort
  if (
    searchParams.sortBy &&
    ["latest", "oldest"].includes(searchParams.sortBy)
  ) {
    params.sortBy = searchParams.sortBy;
  }

  // Parse availability
  if (searchParams.available) {
    params.available = searchParams.available === "true";
  }

  // Parse price range
  if (searchParams.priceMin) {
    const priceMin = parseInt(searchParams.priceMin);
    if (!isNaN(priceMin) && priceMin >= 0) {
      params.priceMin = priceMin;
    }
  }

  if (searchParams.priceMax) {
    const priceMax = parseInt(searchParams.priceMax);
    if (!isNaN(priceMax) && priceMax >= 0) {
      params.priceMax = priceMax;
    }
  }

  // Parse pagination
  if (searchParams.page) {
    const page = parseInt(searchParams.page);
    if (!isNaN(page) && page >= 1) {
      params.page = page;
    }
  }

  if (searchParams.limit) {
    const limit = parseInt(searchParams.limit);
    if (!isNaN(limit) && limit >= 1 && limit <= 100) {
      params.limit = limit;
    }
  }

  return params;
};

const convertParamsToFilters = (params: TFetchExploreAsset) => {
  return {
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    sortBy: params.sortBy,
    available: params.available,
  };
};

const PageWithParams = async ({ searchParams }: PageProps) => {
  const queryClient = new QueryClient();
  const parsedParams = parseSearchParams(searchParams);

  try {
    await queryClient.prefetchQuery(getCategoriesQueryOptions);
    await queryClient.prefetchQuery(getExploreAssetsQueryOptions(parsedParams));

    // If no specific filters are applied, also prefetch common scenarios
    if (Object.keys(parsedParams).length === 0) {
      const commonFilters = [
        { sortBy: "latest" as const },
        { available: true },
        { sortBy: "latest" as const, available: true },
      ];

      await Promise.allSettled(
        commonFilters.map((filters) =>
          queryClient.prefetchQuery(getExploreAssetsQueryOptions(filters)),
        ),
      );
    }
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  const initialPreferences = parsedParams.categories || [];
  const initialFilters = convertParamsToFilters(parsedParams);

  return (
    <EnhancedAuthProvider
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <section className="relative z-50 flex w-full flex-col px-6">
        <div className="mt-5 flex w-full flex-col gap-[50px]">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExploreContainer
              initialPreferences={initialPreferences}
              initialFilters={initialFilters}
            />
          </HydrationBoundary>
        </div>
      </section>
    </EnhancedAuthProvider>
  );
};

export default PageWithParams;
