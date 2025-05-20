import ExploreNav from "@/src/shared/components/explore-nav";
import PostGrid from "@/src/shared/components/postgrid";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <ExploreNav />
        <main className="p-6">
          <PostGrid />
        </main>
      </div>
    </div>
  );
}
