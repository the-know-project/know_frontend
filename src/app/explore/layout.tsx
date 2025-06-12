import ExploreNav from "@/src/features/explore/components/explore-nav";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <section className="flex w-full flex-col">
      <section className="flex min-h-screen w-full flex-col">
        <div className="mt-5 flex w-full">
          <ExploreNav />
        </div>
        {children}
      </section>
    </section>
  );
};

export default Layout;
