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
    router.push("/role");
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <Navbar className="bg-black">
        {/* Desktop Nav */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={INavItems}
            className="font-grotesk text-md font-medium text-neutral-50"
            onSmoothScroll={handleSmoothScroll}
          />

          <NavbarButton colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}>
            <button
              onClick={handleGetStarted}
              className="button_base group py-1.5"
            >
              Get Started{" "}
              <IconArrowRight width={20} height={20} className="button_icon" />
            </button>
          </NavbarButton>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav className="w-full bg-black">
          <MobileNavHeader className="pr-2">
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
                onClick={(e) => handleSmoothScroll(e, item.link)}
                className="relative text-white"
              >
                <span className="font-grotesk block">{item.name}</span>
              </a>
            ))}

            <NavbarButton
              className="mt-5 flex w-full items-center justify-center"
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            >
              <button
                onClick={handleGetStarted}
                className="group button_base w-full justify-center self-center py-2 text-sm"
              >
                Get Started{" "}
                <IconArrowRight
                  width={20}
                  height={20}
                  className="button_icon"
                />
              </button>
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
