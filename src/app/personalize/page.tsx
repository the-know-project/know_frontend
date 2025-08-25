import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import ArtSelection from "@/src/features/personalize/components/art-selection";
import { getCategoriesQueryOptions } from "@/src/features/personalize/queries/get-categories.queries";

import { TitleText } from "@/src/shared/layout/header";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Image from "next/image";

const Page = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery(getCategoriesQueryOptions);
    return (
      <section className="relative z-50 flex w-full flex-col">
        <Image
          src="/Know-Logo.png"
          alt="logo"
          width={60}
          height={60}
          quality={100}
          priority
          className="object-contain object-center"
        />

        <div className="mt-5 flex w-full max-w-prose flex-col gap-2">
          <TitleText textStyles={`w-full`}>
            <h1 className="title_text">Personalize your experience</h1>
          </TitleText>
          <p className="font-bricolage motion-preset-expand motion-duration-700 text-sm text-neutral-500">
            Select your preferred art style
          </p>
        </div>

        <div className="mt-[50px] flex w-full flex-col items-center justify-center">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ArtSelection />
          </HydrationBoundary>
        </div>
      </section>
    );
  } catch (error) {
    return <p>Failed to load preferences: {(error as Error).message}</p>;
  }
};

export default Page;
