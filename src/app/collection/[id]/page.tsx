"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { showLog } from "@/src/utils/logger";
import { useFetchCollection } from "@/src/features/collection/hooks/use-fetch-collection";
import CollectionHeaderForm from "@/src/features/collection/components/collection-header-form";
import CollectionAsset from "@/src/features/collection/components/collection-asset";
import GridBackground from "@/src/shared/components/grid-background";
import { useAuthReady } from "@/src/features/auth/hooks/use-optimized-auth";
import { CollectionViewToggle } from "@/src/constants/constants";
import { IconSearch } from "@tabler/icons-react";
import { FaCaretDown } from "react-icons/fa6";

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
  const [toggledView, setToggledView] =
    useState<keyof typeof buttonRefs>("home");
  const { role } = useAuthReady();

  const collectionData = data?.data;
  const assetData = collectionData?.assetData;

  const homeRef = useRef<HTMLButtonElement>(null);
  const activityRef = useRef<HTMLButtonElement>(null);
  const analyticsRef = useRef<HTMLButtonElement>(null);

  const buttonRefs = useMemo(
    () => ({
      home: homeRef,
      activity: activityRef,
      analytics: analyticsRef,
    }),
    [],
  );

  showLog({
    context: "Dynamic Collection Page",
    data: {
      collectionData: collectionData,
    },
  });

  useLayoutEffect(() => {
    const setDefaultToggle = () => {
      const ref = buttonRefs[toggledView];
      if (!ref.current) return;
      if (ref.current) {
        setToggledView(toggledView);
      }
    };

    setDefaultToggle();
  }, [toggledView, buttonRefs]);
  return (
    <section className="flex min-h-screen w-full flex-col gap-[20px] bg-neutral-50">
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

      <div className="mt-[20px] flex flex-col gap-2 px-6 md:mt-0">
        {/*Collection Asset Toogle*/}
        <div className="justify-none flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row items-center gap-2">
            {CollectionViewToggle.map((_view, index) => (
              <button
                key={_view.id}
                ref={buttonRefs[_view.name]}
                onClick={() => setToggledView(_view.name)}
                className={`motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit flex-shrink-0 rounded-lg px-2 py-2 text-xs font-normal tracking-wider text-nowrap transition-all duration-300 hover:scale-110 active:scale-95 sm:text-sm lg:text-[16px] ${toggledView === _view.name ? "bg-neutral-800 text-white transition-all duration-300" : "bg-transparent text-neutral-800 transition-all duration-300"}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {_view.name}
              </button>
            ))}
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="relative flex w-full">
              <IconSearch className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transform text-neutral-500 sm:left-3 sm:h-5 sm:w-5" />
              <input
                className="font-bricolage placeholder:font-bebas !important flex h-9 w-full max-w-[300px] rounded-lg bg-neutral-800 py-2 pr-9 pl-8 text-sm text-white placeholder:text-xs placeholder:tracking-wider placeholder:text-neutral-100 focus-visible:shadow-none focus-visible:ring-0 sm:h-10 sm:pr-10 sm:pl-10 sm:text-base sm:placeholder:text-sm sm:placeholder:text-neutral-100"
                placeholder="Search item"
              />
            </div>

            <button className="motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit flex-shrink-0 items-center gap-1 rounded-lg bg-neutral-800 px-2 py-2 text-xs font-normal tracking-wider text-nowrap text-white transition-all duration-300 hover:scale-110 active:scale-95 sm:text-sm lg:text-[16px]">
              <p>low to high</p> <FaCaretDown className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <GridBackground>
        <CollectionAsset
          data={assetData}
          artistFirstName={collectionData?.firstName || ""}
          artistLastName={collectionData?.lastName || ""}
          role={role}
        />
      </GridBackground>
    </section>
  );
};

export default Page;
