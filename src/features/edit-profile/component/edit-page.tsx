"use client";

import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Profile Schema matching Figma design
const profileSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
    userSelection: z.enum(["artist", "client"]).optional(),
    sectionTitle: z.string().optional(),
    description: z.string().optional(),
    instagram: z.string().optional(),
    discord: z.string().optional(),
    behance: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfilePageProps {
  userType: "artist" | "client";
  initialData?: Partial<ProfileFormData>;
  onSave: (data: ProfileFormData & { profileImage?: File }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditProfilePage({
  userType,
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}: EditProfilePageProps) {
  const [profileImage, setProfileImage] = useState<string | null>(
    initialData?.profileImage || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userSelection: userType,
      ...initialData,
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
    await onSave({
      ...data,
      profileImage: imageFile || undefined,
    });
  };

  const connectSocial = (platform: string) => {
    console.log(`Connecting ${platform}...`);
    alert(`${platform} connection coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8">
      <div className="mx-auto max-w-[800px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header with Buttons - Matching Figma */}
          <div className="mb-6 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-[#FF6B35] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#FF5722] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save to profile"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-md bg-[#4A5FE8] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3D51D9] disabled:opacity-50"
            >
              Save changes
            </button>
          </div>

          {/* Basic Information Section */}
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
              Basic Information
            </h2>
            <p className="mb-6 text-xs text-gray-400">Basic information</p>

            {/* Profile Image Upload with Upload button */}
            <div className="mb-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
                    {profileImage || initialData?.firstName ? (
                      <img
                        src={
                          profileImage ||
                          `https://ui-avatars.com/api/?name=${initialData?.firstName}+${initialData?.lastName}&size=96`
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="mb-1 flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </button>
                  <p className="text-xs text-gray-400">
                    Click to upload profile picture
                  </p>
                </div>
              </div>
            </div>

            {/* Name Fields - Side by Side */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="OcuareRimini"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Patrick"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-normal text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="alexandrapatrick7@gmail.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* User Selection and Location */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  User selection
                </label>
                <select
                  {...register("userSelection")}
                  className="w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="artist">Artist</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="United Kingdom"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1.5 block text-sm font-normal text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="+8202455104545"
              />
            </div>
          </div>

          {/* About Me Section */}
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
              About Me
            </h2>
            <p className="mb-6 text-xs text-gray-400">Tell us about yourself</p>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-normal text-gray-700">
                Section Title
              </label>
              <input
                type="text"
                {...register("sectionTitle")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="About Me"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-normal text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
              Links
            </h2>
            <p className="mb-6 text-xs text-gray-400">
              Build trust with your network by connecting your social profiles
            </p>

            {/* Instagram */}
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Instagram
                </span>
              </div>
              <button
                type="button"
                onClick={() => connectSocial("Instagram")}
                className="flex items-center gap-1 rounded-md bg-[#4A5FE8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3D51D9]"
              >
                Connect Instagram
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Discord */}
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Discord
                </span>
              </div>
              <button
                type="button"
                onClick={() => connectSocial("Discord")}
                className="flex items-center gap-1 rounded-md bg-[#4A5FE8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3D51D9]"
              >
                Connect Discord
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Behance */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Behance
                </span>
              </div>
              <button
                type="button"
                onClick={() => connectSocial("Behance")}
                className="flex items-center gap-1 rounded-md bg-[#4A5FE8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3D51D9]"
              >
                Connect Behance
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
              Security
            </h2>
            <p className="mb-6 text-xs text-gray-400">Update your password</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  Old Password
                </label>
                <input
                  type="password"
                  {...register("oldPassword")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-normal text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
