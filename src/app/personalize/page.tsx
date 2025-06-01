import { PageAuthGuard } from "@/src/features/auth/guards";
import ArtSelection from "@/src/features/personalize/components/art-selection";
import { TitleText } from "@/src/shared/layout/header";
import Image from "next/image";

const Page = () => {
  return (
    <PageAuthGuard requiresAuth>
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
          <ArtSelection />
        </div>
      </section>
    </PageAuthGuard>
  );
};

export default Page;
