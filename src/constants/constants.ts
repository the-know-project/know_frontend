import React from "react";
import { hero1, hero2, hero3, hero4 } from "../assets";
import { IconPalette, IconMusic, IconShoppingBag } from "@tabler/icons-react";

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
