import GridBackground from "@/src/shared/components/grid-background";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <section className="flex w-full flex-col">
      <GridBackground>{children}</GridBackground>
    </section>
  );
};

export default Layout;
