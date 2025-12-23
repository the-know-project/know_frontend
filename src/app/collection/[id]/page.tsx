"use client";

import React from "react";
import { showLog } from "@/src/utils/logger";
import { useFetchCollection } from "@/src/features/collection/hooks/use-fetch-collection";
import CollectionHeaderForm from "@/src/features/collection/components/collection-header-form";
import CollectionAsset from "@/src/features/collection/components/collection-asset";

interface ICollection {
  params: Promise<{
    id: string;
  }>;
}

const Page: React.FC<ICollection> = ({ params }) => {
  const { id } = React.use(params);
  const { data, isLoading } = useFetchCollection({
    collectionId: id,
  });

  const collectionData = data?.data;
  const assetData = collectionData?.assetData;

  showLog({
    context: "Dynamic Collection Page",
    data: {
      collectionData: collectionData,
    },
  });
  return (
    <section className="flex w-full">
      <CollectionHeaderForm
        title={collectionData?.title || ""}
        bannerUrl={collectionData?.bannerUrl || ""}
        description={collectionData?.description || ""}
        firstName={collectionData?.firstName || ""}
        lastName={collectionData?.lastName || ""}
        profileUrl={collectionData?.assetData?.[0]?.artistProfileUrl || ""}
        numOfArt={collectionData?.numOfArt || 0}
        price={collectionData?.price || ""}
      />

      <div className="flex flex-col gap-2 px-6">
        <h2 className="font-helvetica text-[32px] text-black sm:text-[52px] lg:text-[62px]">
          Art Works
        </h2>

        <CollectionAsset data={assetData} />
      </div>
    </section>
  );
};

export default Page;
