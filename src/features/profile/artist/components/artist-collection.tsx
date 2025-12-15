import ArtistCollectionNav from "./artist-collection-nav";

const ArtistCollection = () => {
  return (
    <section className="relative flex min-h-screen w-full flex-col">
      <div className="bottom fixed">
        <ArtistCollectionNav />
      </div>
    </section>
  );
};

export default ArtistCollection;
