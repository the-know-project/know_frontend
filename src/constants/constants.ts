import React from "react";
import { hero1, hero2, hero3, hero4 } from "../assets";
import { IconPalette, IconShoppingBag } from "@tabler/icons-react";

export const INavItems = [
  {
    name: "About Us",
    link: "#about",
  },
  {
    name: "Community",
    link: "#community",
  },
  {
    name: "Faq",
    link: "#faq",
  },
  {
    name: "Contact Us",
    link: "#contact",
  },
];

export const HeroCarouselItems = [
  {
    name: "hero1",
    image: hero1,
  },
  {
    name: "hero2",
    image: hero2,
  },
  {
    name: "hero3",
    image: hero3,
  },
  {
    name: "hero4",
    image: hero4,
  },
];

export const RoleSelectionItems = [
  {
    id: 1,
    name: "Artist",
    content: "Showcase your art to a global audience and expand your reach",
    icon: React.createElement(IconPalette, { size: 24, stroke: 1.5 }),
  },
  {
    id: 2,
    name: "Buyer",
    content: "Discover unique artworks, connect with artists, and build you",
    icon: React.createElement(IconShoppingBag, { size: 24, stroke: 1.5 }),
  },
] as const;

export enum SOCIALS {
  INSTAGRAM = "https://www.instagram.com/knowcabinet?igsh=em93cWM4OWQ5N2l3&utm_source=qr",
  X = "https://x.com/KnowForCreators",
  LINKEDIN = "https://www.linkedin.com/company/106916933/admin/page-posts/published/",
  TIKTOK = "https://www.tiktok.com/@knowcabinet?_t=ZM-8wmuEXAOZUe&_r=1",
}

export const ExploreFilters = [
  {
    id: 1,
    name: "Medium",
    filter: [
      {
        id: 1,
        name: "Image",
      },
      {
        id: 2,
        name: "Video",
      },
    ],
  },
  {
    id: 2,
    name: "Availability",
    filter: [
      {
        id: 1,
        naame: "For Sale",
      },
      {
        id: 2,
        name: "Not For Sale",
      },
    ],
  },
  {
    id: 3,
    name: "Date Added",
    filters: [
      {
        id: 1,
        name: "Oldest",
      },
      {
        id: 2,
        name: "Latest",
      },
    ],
  },
  {
    id: 4,
    name: "Price Range",
    filters: [
      {
        id: 1,
        name: "$50 - $500",
      },
      {
        id: 2,
        name: "$501 - $1500",
      },
      {
        id: 3,
        name: "$1500 - above",
      },
    ],
  },
] as const;
