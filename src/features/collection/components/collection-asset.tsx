import { showLog } from "@/src/utils/logger";
import { IFetchCollectionAssetData } from "../types/collections.type";

interface ICollectionAsset {
  data: IFetchCollectionAssetData[] | undefined;
}

const CollectionAsset: React.FC<ICollectionAsset> = ({ data }) => {
  showLog({
    context: "Collection Asset",
    data: data,
  });

  if (!data) {
    return <h1>Your collection is empty</h1>;
  }
  return (
    <section>
      <h1>{data[0].fileId}</h1>
    </section>
  );
};

export default CollectionAsset;
