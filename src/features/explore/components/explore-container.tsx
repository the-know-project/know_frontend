"use client";

import { useState, useEffect, useCallback } from "react";
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

  const { isInitialized } = enableServerSync
    ? useSyncLikedAssets()
    : { isInitialized: true };

  // Update state if initial props change (useful for SSR hydration)
  useEffect(() => {
    setSelectedPreferences(initialPreferences);
  }, []);

  useEffect(() => {
    setSelectedFilters(initialFilters);
  }, []);

  const handlePreferencesChange = useCallback((preferences: string[]) => {
    setSelectedPreferences(preferences);
  }, []);

  const handleFiltersChange = useCallback((filters: typeof selectedFilters) => {
    setSelectedFilters(filters);
  }, []);

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
        isInitialized={isInitialized}
      />
    </div>
  );
};

export default ExploreContainer;
