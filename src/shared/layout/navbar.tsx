import { IconArrowRight } from "@tabler/icons-react";
import {
  NavbarLogo,
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
} from "../ui/resizable-navbar";
import { INavItems } from "@/src/constants/constants";

export default function Nav() {
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
      </Navbar>
    </div>
  );
}
