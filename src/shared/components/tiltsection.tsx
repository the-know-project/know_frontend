import Image from "next/image";
import { TitleText } from "../layout/header";

type TiltSectionProps = {
  role: string;
  title: string;
  subtitle: string;
  imgSrc: string;
  reverse?: boolean;
};

export default function TiltSection({
  role,
  title,
  subtitle,
  imgSrc,
  reverse = false,
}: TiltSectionProps) {
  return (
    <section
      className={`flex flex-col items-center justify-between gap-10 bg-white px-6 py-12 text-black md:flex-row ${
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
        </TitleText>
        <p className="font-grotesk text-base text-gray-950">{subtitle}</p>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="rotate-[-6deg] transform overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt="Gallery Image"
            width={400}
            height={300}
            className="object-fit rotate-[-6deg] transform"
          />
        </div>
      </div>
    </section>
  );
}
