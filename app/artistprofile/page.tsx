import Sidebar from "../components/sidebar";
import Header from "../components/header";
import PostGrid from "../components/postgrid";

export default function ArtistProfilePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <PostGrid />
        </main>
      </div>
    </div>
  );
}