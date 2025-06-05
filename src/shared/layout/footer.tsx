import Image from "next/image";
import TextEffectWithExit from "../components/animate-text";
import { INavItems, SOCIALS } from "@/src/constants/constants";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col bg-black text-neutral-50">
      <div className="flex w-full flex-col items-center justify-center px-6 py-10">
        <div className="h-[50px]">
          <TextEffectWithExit text="Powered by stellar" />
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="flex items-center gap-2">
            <Image
              src="/Know-Logo.png"
              alt="Logo"
              width={90}
              height={50}
              quality={100}
              className="object-contain object-center"
            />
          </div>

          <div className="font-bricolage flex flex-col gap-2 text-sm capitalize lg:text-lg">
            {INavItems.map((item, index) => (
              <a key={index} href={item.link}>
                {item.name}
              </a>
            ))}
          </div>

          <div className="mt-5 flex gap-4 text-lg">
            <a href={SOCIALS.INSTAGRAM} target="_blank">
              <IconBrandInstagram
                width={30}
                height={30}
                color="white"
                className="transition-all duration-200 hover:scale-105 active:scale-95 lg:h-[50px] lg:w-[50px]"
              />
            </a>
            <a href={SOCIALS.X} target="_blank">
              <IconBrandX
                width={30}
                height={30}
                color="white"
                className="transition-all duration-200 hover:scale-105 active:scale-95 lg:h-[50px] lg:w-[50px]"
              />
            </a>
            <a href={SOCIALS.LINKEDIN} target="_blank">
              <IconBrandLinkedin
                width={30}
                height={30}
                color="white"
                className="transition-all duration-200 hover:scale-105 active:scale-95 lg:h-[50px] lg:w-[50px]"
              />
            </a>
            <a href={SOCIALS.TIKTOK} target="_blank">
              <IconBrandTiktok
                width={30}
                height={30}
                color="white"
                className="transition-all duration-200 hover:scale-105 active:scale-95 lg:h-[50px] lg:w-[50px]"
              />
            </a>
          </div>
        </div>

        <div className="font-bricolage mt-6 text-center text-sm text-neutral-200 capitalize lg:text-lg">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
