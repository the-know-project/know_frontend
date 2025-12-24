"use client";

import { showLog } from "@/src/utils/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconBrandGmail,
  IconBrandInstagram,
  IconBrandX,
  IconCamera,
  IconLink,
  IconTag,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ICollectionHeaderForm } from "../interface/collection.interface";
import { CollectionHeaderSchema } from "../schema/collection.schema";
import { ICollectionHeaderSchema } from "../types/collections.type";

const CollectionHeaderForm: React.FC<ICollectionHeaderForm> = ({
  firstName,
  lastName,
  title,
  description,
  bannerUrl,
  profileUrl,
  numOfArt,
  price,
}) => {
  const router = useRouter();
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [collectionBannerUrl, setCollectionBannerUrl] = useState<string | null>(
    null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setBannerImage(file);
    const previewUrl = URL.createObjectURL(file);
    setCollectionBannerUrl(previewUrl);
  };

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (bannerUrl) {
      setCollectionBannerUrl(bannerUrl);
    }
  }, [bannerUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ICollectionHeaderSchema>({
    resolver: zodResolver(CollectionHeaderSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      title: title,
      description: description,
      bannerUrl: bannerUrl,
      profileUrl: profileUrl,
      numOfArt: numOfArt,
      price: price,
    },
  });

  const onSubmit = (ctx: ICollectionHeaderSchema) => {
    showLog({
      context: "Collection header form",
      data: {
        message: "Is submitting",
        ctx: ctx,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex w-full flex-col">
        {/*Collection Banner bannerImage*/}
        {collectionBannerUrl && (
          <img
            src={collectionBannerUrl}
            alt="banner"
            className="h-[20vh] w-full object-cover sm:h-[35vh] lg:h-[45vh]"
          />
        )}

        {/*Back Navigation*/}
        <div className="group group absolute top-2 left-2 rounded-3xl border border-neutral-700 bg-neutral-700 p-2 shadow-lg backdrop-blur-2xl">
          <IconArrowLeft
            onClick={handleGoBack}
            width={24}
            height={24}
            className="text-white transition-all duration-300 group-hover:scale-105 active:scale-95"
          />
        </div>

        {/*Artist Profile Image*/}
        {profileUrl && (
          <div className="group absolute -bottom-4 left-2 h-fit w-fit rounded-full bg-transparent p-2 shadow-lg backdrop-blur-2xl">
            <img
              src={profileUrl}
              alt="artist_profile_url"
              className="h-[80px] w-[80px] object-contain object-center lg:h-[100px] lg:w-[100px]"
            />
          </div>
        )}

        {/*Upload Image*/}
        <label
          htmlFor="banner_url"
          className="absolute top-1/2 left-1/2 z-10 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-2 opacity-30 backdrop-blur-2xl hover:opacity-100"
        >
          <IconCamera color="white" className="h-auto w-[50px] lg:w-[80px]" />
          <input
            id="banner_url"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/*Social links*/}
        <div className="absolute right-2 bottom-2 w-fit">
          <div className="flex flex-row items-center gap-3 rounded-3xl bg-transparent p-2 shadow-lg backdrop-blur-2xl">
            <IconBrandInstagram width={20} height={20} color="white" />
            <IconBrandX width={20} height={20} color="white" />
            <IconBrandGmail width={20} height={20} color="white" />
            <IconLink width={20} height={20} color="white" />
          </div>
        </div>
      </div>

      {/*Title*/}
      <div className="mt-5 flex w-full flex-col items-start px-6">
        <input
          {...register("title")}
          type="text"
          placeholder={title}
          className="font-bricolage w-full border-b border-transparent bg-transparent text-[32px] font-bold text-black capitalize transition-colors outline-none placeholder:text-black sm:text-[52px] lg:text-[62px]"
          autoComplete="off"
        />

        {/*Artist and Price*/}
        <div className="font-bricolage flex flex-row items-center gap-2 px-1 text-sm md:px-4">
          {/*Artist Name*/}
          <p className="text-xs font-bold text-neutral-800 uppercase sm:text-sm">{`Curated by ${firstName} ${lastName}`}</p>

          {/*Price Tag*/}
          <div className="flex flex-row items-center gap-2 rounded-3xl bg-green-700 p-2 shadow-lg">
            <IconTag width={15} height={15} color="white" />
            <div className="font-bebas flex w-fit items-center font-bold tracking-wider text-nowrap text-white">
              <span>$</span>{" "}
              <input
                {...register("price")}
                type="text"
                placeholder={Number(price).toFixed(2)}
                className="w-[50px] text-xs text-white outline-none placeholder:text-white"
              />
            </div>
          </div>

          <div className="flex">
            <div className="font-bebas flex items-center rounded-3xl bg-neutral-800 p-2 font-bold tracking-wider shadow-lg backdrop-blur-2xl">
              <p className="text-xs text-white">
                {numOfArt} {numOfArt > 1 ? "items" : "item"}
              </p>
            </div>
          </div>
        </div>

        {/*Description*/}
        <div className="mt-[30px] flex w-full max-w-prose flex-col items-start gap-1 px-2 md:px-4">
          <textarea
            {...register("description")}
            placeholder={description}
            className="font-bricolage text-neutal-800 w-full resize-none border-b border-transparent bg-transparent text-[14px] font-normal transition-colors outline-none placeholder:text-neutral-800"
            rows={5}
            autoComplete="on"
          />
        </div>
      </div>
    </form>
  );
};
export default CollectionHeaderForm;
