import ExploreNav from "@/src/features/explore/components/explore-nav";
import GridBackground from "@/src/shared/components/grid-background";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <section className="flex w-full flex-col">
      <GridBackground>
        <section className="flex w-full flex-col">
          <ExploreNav />
          {children}
        </section>
      </GridBackground>
    </section>
  );
};

export default Layout;
