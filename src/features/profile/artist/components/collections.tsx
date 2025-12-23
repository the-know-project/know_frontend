import { TCollectionData } from "@/src/features/collection/types/collections.type";
import CollectionCard from "@/src/shared/ui/collection-card";
interface ICollections {
  collections: TCollectionData[];
}
const Collections: React.FC<ICollections> = ({ collections }) => {
  return (
    <section className="flex w-full flex-col">
      <div className="grid grid-cols-1 gap-5 space-y-[10px] md:grid-cols-2">
        {collections.map((_collection) => (
          <div key={_collection.id} className="w-full">
            <CollectionCard
              id={_collection.id}
              firstName={_collection.firstName}
              lastName={_collection.lastName}
              src={_collection.bannerUrl}
              numOfArt={_collection.numOfArt}
              title={_collection.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collections;
