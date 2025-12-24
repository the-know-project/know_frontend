import { showLog } from "@/src/utils/logger";
import { IFetchCollectionAssetData } from "../types/collections.type";
import { IconCancel } from "@tabler/icons-react";
import ProfileCard from "../../profile/components/profile-card";
import ExploreCard from "../../explore/components/explore-card";

interface ICollectionAsset {
  data: IFetchCollectionAssetData[] | undefined;
  artistFirstName: string;
  artistLastName: string;
  role: string;
}

const CollectionAsset: React.FC<ICollectionAsset> = ({
  data,
  artistFirstName,
  role,
}) => {
  showLog({
    context: "Collection Asset",
    data: data,
  });

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <IconCancel width={100} height={100} className="text-neutral-600" />
        <h1 className="font-bebas mt-2 text-2xl text-neutral-600 capitalize">
          Your collection is empty
        </h1>
      </div>
    );
  }
  return (
    <section className="grid min-h-screen grid-cols-1 gap-5 space-y-[50px] md:grid-cols-2 lg:grid-cols-3">
      {data.map((_asset) => (
        <ExploreCard
          key={_asset.fileId}
          artName={_asset.artTitle}
          id={_asset.fileId}
          artWork={_asset.assetUrl}
          highResUrl={_asset.assetUrl}
          artistImage={_asset.artistProfileUrl}
          artistName={artistFirstName}
          categories={_asset.artCategories}
          createdAt={_asset.artCreatedAt}
          description={_asset.artDescription}
          isListed={_asset.isArtListed}
          likeCount={_asset.numOfLikes}
          numOfViews={_asset.artViewCount}
          price={Number(_asset.artPrice)}
          role={role}
          size={{
            width: _asset.artSize.width,
            height: _asset.artSize.height,
          }}
          tags={_asset.artTags}
          userId={_asset.artistId}
        />
      ))}
    </section>
  );
};

export default CollectionAsset;
