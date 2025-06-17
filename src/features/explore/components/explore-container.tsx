"use client";

import { useState, useEffect } from "react";
import ExploreCategories from "./explore-categories";
import ExploreCanvas from "./explore-canvas";
import { useSyncLikedAssets } from "../hooks/use-sync-liked-assets";

interface ExploreContainerProps {
  initialPreferences?: string[];
  initialFilters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
  enableServerSync?: boolean; // Optional server sync
}

const ExploreContainer = ({
  initialPreferences = [],
  initialFilters = {},
  enableServerSync = true,
}: ExploreContainerProps = {}) => {
  const [selectedPreferences, setSelectedPreferences] =
    useState<string[]>(initialPreferences);
  const [selectedFilters, setSelectedFilters] = useState<{
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  }>(initialFilters);

  // Optional server sync for liked assets
  const { isInitialized } = enableServerSync
    ? useSyncLikedAssets()
    : { isInitialized: true };

  useEffect(() => {
    if (initialPreferences.length > 0) {
      setSelectedPreferences(initialPreferences);
    }
  }, [initialPreferences]);

  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setSelectedFilters(initialFilters);
    }
  }, [initialFilters]);

  const handlePreferencesChange = (preferences: string[]) => {
    setSelectedPreferences(preferences);
  };

  const handleFiltersChange = (filters: typeof selectedFilters) => {
    setSelectedFilters(filters);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <ExploreCategories
        onPreferencesChange={handlePreferencesChange}
        onFiltersChange={handleFiltersChange}
        selectedPreferences={selectedPreferences}
        selectedFilters={selectedFilters}
      />
      <ExploreCanvas
        categories={selectedPreferences}
        filters={selectedFilters}
      />
    </div>
  );
};

export default ExploreContainer;
