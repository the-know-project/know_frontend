'use client';

import { useState, useEffect } from "react";
import ArtCard from "../components/artcard";
import FilterTabs from "../components/filtertabs";
import mockData from "../data/index";

export default function ArtFeed() {
  const categories = ["All", "Expressionism", "Painting", "Architecture", "Sculpture", "Digital Art", "Illustration", "Photography"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [artworks, setArtworks] = useState(mockData);

  useEffect(() => {
    if (activeCategory === "All") {
      setArtworks(mockData);
    } else {
      const filtered = mockData.filter((item) =>
        item.categories.includes(activeCategory)
      );
      setArtworks(filtered);
    }
  }, [activeCategory]);

  return (
    <div className="px-6 md:px-16 py-10">
      <FilterTabs
        active={activeCategory}
        setActive={setActiveCategory}
        categories={categories}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((item) => (
          <ArtCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
