import { DummyArtPreferences } from "../data/personalize.data";

const ArtSelection = () => {
  return (
    <section className="flex w-full flex-col">
      <div className="grid w-full grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4">
        {DummyArtPreferences.map((pref, index) => (
          <button
            key={index}
            className="motion-duration-500 motion-preset-expand font-bebas transiton-all flex w-fit rounded-md bg-black px-2 py-1 text-sm font-bold text-nowrap text-white shadow-md duration-300 hover:scale-110 active:scale-95 active:bg-neutral-800"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {pref.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ArtSelection;
