"use client";

import { IconArrowRight } from "@tabler/icons-react";
import {
  NavbarLogo,
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/resizable-navbar";
import { INavItems } from "@/src/constants/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setIsMobileMenuOpen(false);
    router.push("/auth");
  };
  return (
    <div className="relative">
      <Navbar className="bg-black">
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={INavItems}
            className="font-grotesk font-medium text-neutral-50"
          />

          <NavbarButton colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}>
            <button className="font-grotesk group relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-2.5 py-1.5 text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200">
              Get Started{" "}
              <IconArrowRight
                width={20}
                height={20}
                className="-rotate-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </NavbarButton>
        </NavBody>

        <MobileNav className="w-full bg-black">
          <MobileNavHeader className="px-2">
            <NavbarLogo />

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {INavItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white"
              >
                <span className="font-grotesk text-md block">{item.name}</span>
              </a>
            ))}

            <NavbarButton
              className="mt-5 flex w-full items-center justify-center"
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            >
              <button
                onClick={handleGetStarted}
                className="font-grotesk group relative inline-flex w-full items-center justify-center gap-1 self-center rounded-md bg-zinc-950 px-2.5 py-2 text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200"
              >
                Get Started{" "}
                <IconArrowRight
                  width={20}
                  height={20}
                  className="-rotate-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
