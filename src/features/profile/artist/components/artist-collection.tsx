import ArtistCollectionNav from "./artist-collection-nav";
import Collections from "./collections";

const ArtistCollection = () => {
  return (
    <section className="relative -mt-[50px] flex w-full flex-col">
      <Collections />
      <div className="sticky bottom-0 z-50 self-center px-4 lg:hidden">
        <ArtistCollectionNav />
      </div>
    </section>
  );
};

export default ArtistCollection;
