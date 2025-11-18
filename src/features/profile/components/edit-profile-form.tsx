"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconInfoCircle,
  IconLink,
  IconLock,
  IconCreditCard,
  IconChevronLeft,
  IconCamera,
} from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUser } from "@/src/features/auth/state/selectors/token.selectors";
import { useUpdateProfile } from "@/src/features/profile/hooks/use-update-profile";
import { ProfileFormData } from "../types/profile.types";
import { ProfileFormSchema } from "../dto/profile.dto";

interface IEditProfileForm {
  userId: string;
  onClose: () => void;
}

const EditProfileForm: React.FC<IEditProfileForm> = ({ onClose }) => {
  const user = useTokenStore(selectUser);
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfile();

  const [profileImage, setProfileImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: "",
      email: user?.email || "",
      userSelection: user?.role || "",
      country: "",
      phoneNumber: "",
      sectionTitle: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user?.imageUrl) {
      setProfileImage(user.imageUrl);
    }
  }, [user]);

  useEffect(() => {
    setHasChanges(isDirty || !!imageFile);
  }, [isDirty, imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    console.log(`image file ${imageFile}`);
    try {
      await updateProfile({
        ...data,
        profilePicture: imageFile || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleBackToProfile = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (confirmLeave) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleBackToProfile}
            className="rounded-full p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
          >
            <IconChevronLeft size={20} className="sm:h-6 sm:w-6" />
          </button>
          <h1 className="font-bricolage text-lg font-bold sm:text-2xl">
            Edit Profile
          </h1>
        </div>
        <button
          type="submit"
          disabled={isUpdating || !hasChanges}
          className="font-bricolage rounded-full bg-black px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-6 sm:py-2 sm:text-base"
        >
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          {/* Profile Picture Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg sm:h-32 sm:w-32">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <IconUser
                        size={36}
                        className="text-white sm:h-12 sm:w-12"
                      />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-black p-1.5 text-white shadow-lg transition-colors hover:bg-gray-800 sm:p-2"
                >
                  <IconCamera size={16} className="sm:h-5 sm:w-5" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bricolage mb-1 text-xs text-gray-600 sm:mb-2 sm:text-sm">
                  Upload a new profile picture
                </p>
                <p className="font-bricolage text-[10px] text-gray-400 sm:text-xs">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  First Name *
                </label>
                <div className="relative">
                  <IconUser
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("firstName")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Last Name *
                </label>
                <div className="relative">
                  <IconUser
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("lastName")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Email *
                </label>
                <div className="relative">
                  <IconMail
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Phone Number
                </label>
                <div className="relative">
                  <IconPhone
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Location *
                </label>
                <div className="relative">
                  <IconMapPin
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("country")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter location"
                  />
                </div>
                {errors.country && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  User Type *
                </label>
                <select
                  {...register("userSelection")}
                  className="font-bricolage w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                >
                  <option value="">Select type</option>
                  <option value="ARTIST">Artist</option>
                  <option value="BUYER">Buyer</option>
                </select>
                {errors.userSelection && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.userSelection.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              About Me
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Section Title
                </label>
                <div className="relative">
                  <IconInfoCircle
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("sectionTitle")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="e.g., Professional Summary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="font-bricolage w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              Social Links
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="font-bricolage text-xs text-gray-600 sm:text-sm">
                Connect your social media accounts (Coming soon)
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled
                >
                  <IconLink size={14} className="mr-1.5 inline sm:mr-2" />
                  Instagram
                </button>
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled
                >
                  <IconLink size={14} className="mr-1.5 inline sm:mr-2" />
                  Twitter
                </button>
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled
                >
                  <IconLink size={14} className="mr-1.5 inline sm:mr-2" />
                  Facebook
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              Security
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Old Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("oldPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter old password"
                  />
                </div>
                {errors.oldPassword && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  New Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("newPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Confirm New Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black sm:py-3 sm:text-base"
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="font-bricolage mt-1 text-xs text-red-600 sm:text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="font-bricolage mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
              Payment Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="font-bricolage text-xs text-gray-600 sm:text-sm">
                Manage your payment methods (Coming soon)
              </p>
              <button
                type="button"
                className="font-bricolage rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
                disabled
              >
                <IconCreditCard size={14} className="mr-1.5 inline sm:mr-2" />
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default React.memo(EditProfileForm);
