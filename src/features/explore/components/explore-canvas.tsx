import { ExploreDemoItem } from "@/src/constants/constants";
import ExploreCard from "./explore-card";

const ExploreCanvas = () => {
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ExploreDemoItem.map((item, index) => (
          <div
            key={item.id}
            className="motion-preset-expand motion-duration-700"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <ExploreCard
              id={item.id}
              artWork={item.artWork}
              artName={item.artName}
              artistImage={item.artistImage}
              artistName={item.artistName}
              likeCount={item.likeCount}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCanvas;
