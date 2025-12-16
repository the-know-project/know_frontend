import { CollectionData } from "@/src/constants/constants";
import CollectionCard from "@/src/shared/ui/collection-card";

const Collections = () => {
  return (
    <section className="grid grid-cols-1 gap-5 space-y-[10px] md:grid-cols-2">
      {CollectionData.map((_collection) => (
        <div key={_collection.id} className="w-full">
          <CollectionCard
            id={_collection.id}
            firstName={_collection.firstName}
            lastName={_collection.lastName}
            src={_collection.src}
            numOfArt={_collection.numOfArt}
            title={_collection.title}
          />
        </div>
      ))}
    </section>
  );
};

export default Collections;
