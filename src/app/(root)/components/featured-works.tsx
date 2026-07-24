import { TitleText } from "@/src/shared/layout/header";

const FeaturedWorks = () => {
  return (
    <section className="c-space flex min-h-screen flex-col items-center justify-center bg-black">
      <TitleText textStyles={`w-full max-w-prose`}>
        <h3 className="font-bebas text-2xl font-black tracking-wider text-neutral-400 capitalize md:text-3xl">
          Featured <span className="text-neutral-950">Works</span>
        </h3>
        <p className="about_content_text mt-4">
          Explore a curated selection of exceptional works from our talented
          creators. Each piece represents the pinnacle of creativity and
          craftsmanship, showcasing the diverse talents within our community.
        </p>
      </TitleText>
    </section>
  );
};

export default FeaturedWorks;
