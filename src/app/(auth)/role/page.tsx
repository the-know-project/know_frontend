import GridBackground from "@/src/shared/components/grid-background";
import SelectRole from "@/src/shared/components/role-selection";

const Page = () => {
  return (
    <section className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <SelectRole />
        </>
      </GridBackground>
    </section>
  );
};

export default Page;
