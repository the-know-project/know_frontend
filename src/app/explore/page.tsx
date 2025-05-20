"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ExplorePage = () => {
  const filters = [
    "neoexpressionism",
    "Painting",
    "Architecture",
    "Sculpture",
    "Digital Art",
    "Illustration",
    "Photography",
    "Drawing",
  ];

  const artworks = new Array(9).fill({
    name: "Artist Name",
    likes: "16k",
    image: "/placeholder.png",
  });

  const [showSubFilters, setShowSubFilters] = useState(false);

  return (
    <div className="px-6 py-4">
      {/* Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Image src="/Know-Logo.png" alt="Know logo" width={80} height={40} />
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full max-w-xs"
        />
        <Link href="/upload">
          <button className="btn btn-primary">Share your work</button>
        </Link>
        <div className="avatar">
          <div className="w-10 rounded-full">
            <Image src="/avatar.png" alt="User" width={40} height={40} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-4">
        <a className="tab tab-active">For You</a>
        <a className="tab">Following</a>
      </div>

      {/* Filters */}
      <div className="mb-4 w-full">
        <div className="flex flex-1 flex-wrap gap-2 md:w-full md:justify-between">
          {filters.map((filter, index) => (
            <button key={index} className="btn btn-outline btn-sm">
              {filter}
            </button>
          ))}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowSubFilters(!showSubFilters)}
          >
            Filters
          </button>
        </div>
      </div>

      {/* Sub Filters (toggleable) */}
      {showSubFilters && (
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-700 md:grid-cols-4">
          <div>
            <h4 className="mb-1 font-semibold">Medium</h4>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline">Image</button>
              <button className="btn btn-sm btn-outline">Video</button>
            </div>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Availability</h4>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline">For Sale</button>
              <button className="btn btn-sm btn-outline">Auctioned</button>
              <button className="btn btn-sm btn-outline">Not For Sale</button>
            </div>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Date Added</h4>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline">Oldest</button>
              <button className="btn btn-sm btn-outline">Latest</button>
            </div>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Price Range</h4>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline">$50 - $500</button>
              <button className="btn btn-sm btn-outline">$501 - $950</button>
              <button className="btn btn-sm btn-outline">$950 above</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {artworks.map((art, index) => (
          <div key={index} className="card bg-base-100 shadow-md">
            <figure className="h-60 bg-gray-200">
              <Image
                src={art.image}
                alt={art.name}
                width={500}
                height={300}
                className="h-full w-full object-cover"
              />
            </figure>
            <div className="card-body flex flex-row items-center justify-between p-4">
              <div>
                <h2 className="card-title mb-1 text-sm font-semibold">
                  {art.name}
                </h2>
                <p className="text-xs text-gray-500">{art.likes} likes</p>
              </div>
              <button className="btn btn-ghost btn-circle text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
