import Sidebar from "../components/sidebar";
import PostGrid from "../components/postgrid";
import HeaderInside from "../components/headerinside";

export default function ArtistProfilePage() {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderInside />
        <main className="p-6">
          <PostGrid />
        </main>
      </div>
    </div>
  );
}