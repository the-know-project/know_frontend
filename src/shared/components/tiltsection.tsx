"use client";

import Image, { StaticImageData } from "next/image";
import { TitleText } from "../layout/header";
import useIsVisible from "../hooks/use-is-visible";

type TiltSectionProps = {
  role: string;
  title: string;
  subtitle: string;
  imgSrc: string | StaticImageData;
  reverse?: boolean;
};

export default function TiltSection({
  role,
  title,
  subtitle,
  imgSrc,
  reverse = false,
}: TiltSectionProps) {
  const { ref, isVisible } = useIsVisible();
  return (
    <section
      className={`flex flex-col items-center justify-between gap-10 bg-neutral-50 px-6 py-12 text-black md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1">
        <TitleText textStyles={`w-full max-w-prose`}>
          <p className="font-bebas text-sm text-neutral-400 uppercase">
            {role}
          </p>
          <h2 className="font-helvetica mb-4 text-2xl font-medium capitalize md:text-3xl">
            {title}
          </h2>
          <p className="font-grotesk text-md max-w-prose text-gray-950 md:text-lg">
            {subtitle}
          </p>
        </TitleText>
      </div>

      <div className="flex w-full flex-1 justify-center">
        <div className="relative rotate-[-6deg] transform overflow-hidden rounded-xl">
          <Image
            ref={ref}
            src={imgSrc}
            alt="Gallery Image"
            width={400}
            height={300}
            className={`object-fit relat rotate-[-6deg] transform ${isVisible ? "motion-preset-expand motion-duration-1000" : "opacity-0"}`}
          />
        </div>
      </div>
    </section>
  );
}
