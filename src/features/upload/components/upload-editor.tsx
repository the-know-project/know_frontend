"use client";

import { useState } from "react";
import { Check, Hash, Plus, Ruler, Shapes, Sparkles, Text } from "lucide-react";
import {
  useAddCategories,
  useGetCategories,
} from "@/src/features/personalize/hooks";
import { useUploadContext } from "../context/upload-context";
import CategoryPickerForm from "./category-picker.form";
import DescriptionForm from "./description.form";
import SizePickerForm from "./size-picker.form";
import TagPickerForm from "./tag-picker.form";

const UploadEditor = () => {
  const { uploadData, updateCategories } = useUploadContext();
  const categoriesQuery = useGetCategories();
  const addCategories = useAddCategories();
  const [newCategory, setNewCategory] = useState("");
  const [categoryFeedback, setCategoryFeedback] = useState("");
  const [categoryFeedbackIsError, setCategoryFeedbackIsError] = useState(false);

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const category = newCategory.trim().replace(/\s+/g, " ");
    if (!category) return;

    const existingCategory = categoriesQuery.data?.data.find(
      (item) => item.toLowerCase() === category.toLowerCase(),
    );
    if (existingCategory) {
      if (
        !uploadData.categories.some(
          (item) => item.toLowerCase() === existingCategory.toLowerCase(),
        )
      ) {
        updateCategories([...uploadData.categories, existingCategory]);
      }
      setNewCategory("");
      setCategoryFeedbackIsError(false);
      setCategoryFeedback(
        `“${existingCategory}” is already available and has been selected.`,
      );
      return;
    }

    setCategoryFeedback("");
    setCategoryFeedbackIsError(false);
    try {
      const response = await addCategories.mutateAsync([category]);
      const addedCategory = response.data[0] || category.toLowerCase();
      if (
        !uploadData.categories.some(
          (item) => item.toLowerCase() === addedCategory.toLowerCase(),
        )
      ) {
        updateCategories([...uploadData.categories, addedCategory]);
      }
      setNewCategory("");
      setCategoryFeedbackIsError(false);
      setCategoryFeedback(`“${addedCategory}” is ready and selected.`);
    } catch (error) {
      setCategoryFeedbackIsError(true);
      setCategoryFeedback(
        error instanceof Error
          ? error.message
          : "Could not add this category. Please try again.",
      );
    }
  };

  const sections = [
    {
      number: "01",
      title: "Description",
      detail: "Give your work a little context.",
      icon: Text,
      content: <DescriptionForm />,
    },
    {
      number: "02",
      title: "Tags",
      detail: "Add a few keywords people might search for.",
      icon: Hash,
      content: <TagPickerForm />,
    },
    {
      number: "03",
      title: "Dimensions",
      detail: "Help viewers understand its size.",
      icon: Ruler,
      content: <SizePickerForm />,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 pb-8 sm:space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-indigo-950 p-5 text-white shadow-lg sm:p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="font-grotesk text-xs font-semibold tracking-[0.18em] text-white/55 uppercase">
          Make it yours
        </p>
        <h2 className="font-helvetica mt-1 text-2xl font-bold sm:text-3xl">
          Add the finishing touches
        </h2>
        <p className="font-grotesk mt-2 max-w-md text-sm leading-6 text-white/70">
          A little detail helps the right people find and appreciate your work.
        </p>
      </div>

      {sections.map(({ number, title, detail, icon: Icon, content }) => (
        <section
          key={number}
          className={`rounded-2xl border border-neutral-200/80 bg-white shadow-sm ${
            number === "03"
              ? "relative z-10 overflow-visible"
              : "overflow-hidden"
          }`}
        >
          <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
            <span className="font-grotesk mt-0.5 text-xs font-semibold tracking-widest text-neutral-400">
              {number}
            </span>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div>
                <h3 className="font-helvetica text-lg font-bold text-neutral-900">
                  {title}
                </h3>
                <p className="font-grotesk mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                  {detail}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="px-2 pt-1 pb-3 sm:px-3">{content}</div>
        </section>
      ))}

      <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
        <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <span className="font-grotesk mt-0.5 text-xs font-semibold tracking-widest text-indigo-400">
            04
          </span>
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div>
              <h3 className="font-helvetica text-lg font-bold text-neutral-900">
                Category
              </h3>
              <p className="font-grotesk mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                Choose a category, or add one if it is missing.
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#1E3A8A]">
              <Shapes className="h-4 w-4" />
            </span>
          </div>
        </div>

        <CategoryPickerForm />

        <form
          onSubmit={handleAddCategory}
          className="mx-4 mb-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 p-3 sm:mx-5 sm:mb-5 sm:p-4"
        >
          <label
            htmlFor="new-upload-category"
            className="font-grotesk mb-2 block text-xs font-semibold text-neutral-700"
          >
            Missing a category?
          </label>
          <div className="flex gap-2">
            <input
              id="new-upload-category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="e.g. ceramic sculpture"
              maxLength={50}
              className="font-grotesk min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 transition outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={!newCategory.trim() || addCategories.isPending}
              className="font-grotesk inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              {addCategories.isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>{addCategories.isPending ? "Adding" : "Add"}</span>
            </button>
          </div>
          {categoryFeedback && (
            <p
              role={categoryFeedbackIsError ? "alert" : "status"}
              className={`font-grotesk mt-2 flex items-start gap-1.5 text-xs ${
                categoryFeedbackIsError ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {!categoryFeedbackIsError && (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <span>{categoryFeedback}</span>
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default UploadEditor;
