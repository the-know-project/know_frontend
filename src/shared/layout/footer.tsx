import Image from "next/image";
import TextEffectWithExit from "../components/animate-text";
import { INavItems } from "@/src/constants/constants";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col bg-black px-6 py-10 text-neutral-50">
      <div className="h-[50px]">
        <TextEffectWithExit text="Powered by stellar" />
      </div>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2">
          <Image
            src="/Know-Logo.png"
            alt="Logo"
            width={50}
            height={50}
            quality={100}
          />
        </div>

        <div className="font-grotesk flex flex-col gap-2 text-sm capitalize">
          {INavItems.map((item, index) => (
            <a key={index} href={item.link}>
              {item.name}
            </a>
          ))}
        </div>

        <div className="mt-5 flex gap-4 text-lg">
          <a href="#">
            <IconBrandInstagram
              width={30}
              height={30}
              color="white"
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            />
          </a>
          <a href="#">
            <IconBrandX
              width={30}
              height={30}
              color="white"
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            />
          </a>
          <a href="#">
            <IconBrandLinkedin
              width={30}
              height={30}
              color="white"
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            />
          </a>
        </div>
      </div>

      <div className="font-grotesk mt-6 text-center text-sm text-neutral-200 capitalize">
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}
