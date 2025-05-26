"use client";

import useIsVisible from "@/src/shared/hooks/use-is-visible";
import { TitleText } from "@/src/shared/layout/header";
import Image, { StaticImageData } from "next/image";

type TiltSectionProps = {
  role: string;
  title: string;
  subtitle: string;
  imgSrc: string | StaticImageData;
  glow_color: string;
  reverse?: boolean;
};

export default function TiltSection({
  role,
  title,
  subtitle,
  imgSrc,
  glow_color,
  reverse = false,
}: TiltSectionProps) {
  const { ref, isVisible } = useIsVisible();
  return (
    <section
      className={`z-50 flex flex-col items-center justify-between gap-10 bg-transparent px-6 py-12 text-black md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1">
        <TitleText textStyles={`w-full max-w-prose`}>
          <p className="font-bebas text-lg text-neutral-400 uppercase">
            {role}
          </p>
          <h2 className="font-helvetica mb-4 text-2xl font-medium capitalize md:text-3xl">
            {title}
          </h2>
          <p className="about_content_text">{subtitle}</p>
        </TitleText>
      </div>

      <div className="flex w-full flex-1 justify-center">
        <div
          className={`${glow_color} relative rotate-[-6deg] transform-gpu rounded-xl ${isVisible ? "motion-preset-expand motion-duration-1000" : "opacity-0"}`}
          style={{
            padding: "20px", // Add padding to prevent clipping
          }}
        >
          <div className="overflow-hidden rounded-xl">
            <Image
              ref={ref}
              src={imgSrc}
              alt="Gallery Image"
              width={400}
              height={300}
              quality={100}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
