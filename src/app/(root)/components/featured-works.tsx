import { TitleText } from "@/src/shared/layout/header";
import { FeaturedWorksCarousel } from "./featured-works-carousel";

const FeaturedWorks = () => {
  return (
    <section className="flex min-h-screen w-full flex-col bg-black px-6 py-12">
      <TitleText textStyles={`w-full max-w-prose`}>
        <h3 className="font-bebas text-glow text-3xl font-black tracking-wider text-neutral-50 capitalize md:text-4xl lg:text-5xl">
          Featured Works
        </h3>
        <p className="about_content_text mt-4">
          Explore a curated selection of exceptional works from our talented
          creators. Each piece represents the pinnacle of creativity and
          craftsmanship, showcasing the diverse talents within our community.
        </p>
      </TitleText>

      <div className="mt-8 flex w-full items-center justify-center">
        <FeaturedWorksCarousel />
      </div>
    </section>
  );
};

export default FeaturedWorks;
