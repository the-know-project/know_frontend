"use client";

import React from "react";
import { showLog } from "@/src/utils/logger";
import { useFetchCollection } from "@/src/features/collection/hooks/use-fetch-collection";
import CollectionHeaderForm from "@/src/features/collection/components/collection-header-form";

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

  showLog({
    context: "Dynamic Collection Page",
    data: {
      collectionData: collectionData,
    },
  });
  return (
    <section>
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
    </section>
  );
};

export default Page;
