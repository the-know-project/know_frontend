"use client";

import { showLog } from "@/src/utils/logger";
import { ICollectionHeaderForm } from "../interface/collection.interface";
import { useForm } from "react-hook-form";
import { ICollectionHeaderSchema } from "../types/collections.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionHeaderSchema } from "../schema/collection.schema";
import { useState } from "react";

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
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [collectionBannerUrl, setCollectionBannerUrl] = useState<string>(
    bannerUrl || "",
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

  const onSubmit = () => {
    showLog({
      context: "Collection header form",
      data: {
        message: "Is submitting",
        bannerImage: bannerImage,
      },
    });
  };

  return <form onSubmit={handleSubmit(onSubmit)}></form>;
};
export default CollectionHeaderForm;
