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
    filters: {
      items: [
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
  },
  {
    id: 2,
    name: "Availability",
    filters: {
      items: [
        {
          id: 1,
          name: "For Sale",
        },
        {
          id: 2,
          name: "Not For Sale",
        },
      ],
    },
  },
  {
    id: 3,
    name: "Date Added",
    filters: {
      items: [
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
  },
  {
    id: 4,
    name: "Price Range",
    filters: {
      items: [
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
  },
];

export const ExploreDemoItem = [
  {
    id: 1,
    artistName: "Victoria Hydon",
    artName: "The ark",
    artWork: "/Painting1.png",
    artistImage: "/Avatar.png",
    likeCount: 33,
  },
  {
    id: 2,
    artistName: "Aina Mafoluku",
    artName: "Black Marine",
    artWork: "/Painting2.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 3,
    artistName: "Tayo Adebanjo",
    artName: "Wyoming",
    artWork: "/Painting3.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 4,
    artistName: "Princess Ugoeze",
    artName: "Azikwe",
    artWork: "/Painting4.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 5,
    artistName: "Victoria Hydon",
    artName: "Sango Ota",
    artWork: "/Painting5.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 6,
    artistName: "Jide Awolowo",
    artName: "Cross Roads",
    artWork: "/Painting4.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 7,
    artistName: "Victoria Hydon",
    artName: "Dejavu",
    artWork: "/Painting1.png",
    artistImage: "/Avatar.png",
    likeCount: 33,
  },
  {
    id: 8,
    artistName: "Aina Mafoluku",
    artName: "Black Marine",
    artWork: "/Painting2.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 9,
    artistName: "Tayo Adebanjo",
    artName: "Lesiure",
    artWork: "/Painting3.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 10,
    artistName: "Princess Ugoeze",
    artName: "Azikwe",
    artWork: "/Painting4.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 11,
    artistName: "Victoria Hydon",
    artName: "Lolade",
    artWork: "/Painting5.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
  {
    id: 12,
    artistName: "Jide Awolowo",
    artName: "The Ocean Glaciers",
    artWork: "/Painting4.png",
    artistImage: "/Avatar.png",
    likeCount: 50,
  },
];

export const MockNotifications = [
  {
    userId: "randomuserid",
    id: "1",
    image: "/Avatar.png",
    content: "Followed you",
    type: "asset",
    createdAt: Date.now(),
  },
  {
    userId: "randomuserid",
    id: "2",
    image: "/Avatar.png",
    content: "Followed you",
    type: "asset",
    createdAt: Date.now(),
  },
];

export const ProfileModalItemsBuyer = [
  {
    id: 1,
    title: "My Profile",
  },

  {
    id: 2,
    title: "Switch to Artist",
  },
  {
    id: 3,
    title: "Payment Information",
  },
  {
    id: 4,
    title: "Transaction History",
  },
  {
    id: 5,
    title: "Settings",
  },
  {
    id: 6,
    title: "Edit Profile",
  },
  {
    id: 7,
    title: "Sign Out",
  },
];

export const ProfileModalItemsArtist = [
  {
    id: 1,
    title: "My Profile",
  },
  {
    id: 2,
    title: "Switch to Buyer",
  },
  {
    id: 3,
    title: "Auctioned Works",
  },
  {
    id: 4,
    title: "Payment Information",
  },
  {
    id: 5,
    title: "Settings",
  },
  {
    id: 6,
    title: "Help",
  },
  {
    id: 7,
    title: "Edit Profile",
  },
  {
    id: 8,
    title: "Sign Out",
  },
];

export const BlankProfilePicture =
  "https://www.kravemarketingllc.com/wp-content/uploads/2018/09/placeholder-user-500x500.png";

export const ArtistProfileToggle = [
  {
    id: 1,
    name: "posts",
  },
  {
    id: 2,
    name: "stats",
  },
  {
    id: 3,
    name: "drafts",
  },
];

export const posts = [
  {
    id: 1,
    title: "Soul Eyes",
    views: "700K",
    comments: 0,
    createdAt: "3 weeks ago",
    image: "/Art2.png",
  },
  {
    id: 2,
    title: "Introspection",
    views: "39K",
    comments: 2,
    createdAt: "1 month ago",
    image: "/Art2.png",
  },
];
