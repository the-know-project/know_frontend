"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useState, useEffect } from "react";
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
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
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBackToProfile}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <IconChevronLeft size={24} />
          </button>
          <h1 className="font-bricolage text-2xl font-bold">Edit Profile</h1>
        </div>
        <button
          type="submit"
          disabled={isUpdating || !hasChanges}
          className="font-bricolage rounded-full bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Profile Picture Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
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
                      <IconUser size={48} className="text-white" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-black p-2 text-white shadow-lg transition-colors hover:bg-gray-800"
                >
                  <IconCamera size={20} />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="font-bricolage mb-2 text-sm text-gray-600">
                  Upload a new profile picture
                </p>
                <p className="font-bricolage text-xs text-gray-400">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <div className="relative">
                  <IconUser
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("firstName")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <div className="relative">
                  <IconUser
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("lastName")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <IconMail
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <IconPhone
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <div className="relative">
                  <IconMapPin
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("country")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter location"
                  />
                </div>
                {errors.country && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  User Type *
                </label>
                <select
                  {...register("userSelection")}
                  className="font-bricolage w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                >
                  <option value="">Select type</option>
                  <option value="ARTIST">Artist</option>
                  <option value="BUYER">Buyer</option>
                </select>
                {errors.userSelection && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.userSelection.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              About Me
            </h2>
            <div className="space-y-6">
              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <div className="relative">
                  <IconInfoCircle
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("sectionTitle")}
                    type="text"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="e.g., Professional Summary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="font-bricolage w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              Social Links
            </h2>
            <div className="space-y-4">
              <p className="font-bricolage text-sm text-gray-600">
                Connect your social media accounts (Coming soon)
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                  disabled
                >
                  <IconLink size={16} className="mr-2 inline" />
                  Instagram
                </button>
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                  disabled
                >
                  <IconLink size={16} className="mr-2 inline" />
                  Twitter
                </button>
                <button
                  type="button"
                  className="font-bricolage rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                  disabled
                >
                  <IconLink size={16} className="mr-2 inline" />
                  Facebook
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              Security
            </h2>
            <div className="space-y-6">
              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("oldPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter old password"
                  />
                </div>
                {errors.oldPassword && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("newPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bricolage mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <IconLock
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="font-bricolage w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="font-bricolage mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bricolage mb-6 text-xl font-semibold">
              Payment Information
            </h2>
            <div className="space-y-4">
              <p className="font-bricolage text-sm text-gray-600">
                Manage your payment methods (Coming soon)
              </p>
              <button
                type="button"
                className="font-bricolage rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                disabled
              >
                <IconCreditCard size={16} className="mr-2 inline" />
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfileForm;
