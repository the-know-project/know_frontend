import ExploreNav from "@/src/features/explore/components/explore-nav";
import { Sidebar } from "@/src/features/profile";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mt-2 flex w-full flex-col">
        <ExploreNav />
      </div>

      <div className="mt-[80px] flex w-full gap-[50px]">
        <div className="flex-start slide-in-from-bottom flex flex-col">
          <Sidebar />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
