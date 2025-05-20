// components/TiltSection.tsx
import Image from "next/image";

type TiltSectionProps = {
  title: string;
  subtitle: string;
  imgSrc: string;
  reverse?: boolean; 
};

export default function TiltSection({
  title,
  subtitle,
  imgSrc,
  reverse = false,
}: TiltSectionProps) {
  return (
    <section
      className={`flex flex-col md:flex-row bg-white text-black items-center justify-between px-6 py-12 gap-10 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      
      <div className="flex-1">
        <p className="text-xs uppercase text-neutral-400">For Artists</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-base text-gray-950">{subtitle}</p>
      </div>

      
      <div className="flex-1 flex justify-center">
        <div className="transform rotate-[-6deg] overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt="Gallery Image"
            width={400}
            height={300}
            className="object-fit transform rotate-[-6deg] "
          />
        </div>
      </div>
    </section>
  );
}
