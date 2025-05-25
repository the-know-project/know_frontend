import Image from "next/image";
import { TitleText } from "../layout/header";
import JoinCtaForm from "./joincta.form";

export default function JoinCTA() {
  return (
    <section
      id="community"
      className="relative overflow-hidden bg-gradient-to-br from-[#0a0f3c] to-[#08104d] px-6 py-20 text-white"
    >
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-full max-w-[500px] justify-end pr-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="ml-3">
            <Image
              src="/Vector 1.png"
              alt="Vector"
              width={100}
              height={400}
              className="h-full object-contain"
            />
          </div>
        ))}
      </div>

      <TitleText textStyles={`flex flex-col w-full`}>
        <div className="relative z-10 mx-auto max-w-3xl gap-5 md:ml-11">
          <p className="font-bebas mb-2 text-lg text-neutral-300 uppercase">
            Ready to join?
          </p>
          <h2 className="font-helvetica mb-6 max-w-prose text-3xl font-bold capitalize md:text-4xl">
            Start your journey today. Showcase your talent or discover
            incredible art.
          </h2>
          <div>
            <JoinCtaForm />
          </div>
        </div>
      </TitleText>
    </section>
  );
}
