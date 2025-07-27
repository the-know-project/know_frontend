import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface EditProfileToggleState {
  toggleEditProfile: (id: string) => void;
  editingProfileId: string | null;
}

const useEditProfileToggleStore = create<EditProfileToggleState>()(
  persist(
    immer((set) => ({
      toggleEditProfile: (id: string) =>
        set((state) => ({
          editingProfileId: state.editingProfileId === id ? null : id,
        })),
      editingProfileId: null,
    })),
    {
      name: "edit-profile-toggle-store",
    },
  ),
);

export const useIsEditProfileToggled = (id: string) =>
  useEditProfileToggleStore((state) => state.editingProfileId === id);

export const useToggleEditProfile = () =>
  useEditProfileToggleStore((state) => state.toggleEditProfile);
