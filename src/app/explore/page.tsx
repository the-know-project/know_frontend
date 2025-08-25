import ExploreContainer from "@/src/features/explore/components/explore-container";

const Page = () => {
  return (
    <section className="flex w-full flex-col px-6">
      <div className="mt-5 flex w-full flex-col gap-[50px]">
        <ExploreContainer enableServerSync={true} />
      </div>
    </section>
  );
};

export default Page;
