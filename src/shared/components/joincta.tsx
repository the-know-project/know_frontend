import Image from "next/image";

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

      <div className="relative z-10 mx-auto max-w-3xl md:ml-11">
        <p className="font-bebas mb-2 text-lg text-neutral-300 uppercase">
          Ready to join?
        </p>
        <h2 className="font-helvetica mb-6 max-w-prose text-3xl font-bold capitalize md:text-4xl">
          Showcase your talent or discover incredible art — start your journey
          today.
        </h2>

        <form className="mx-auto flex max-w-lg items-center justify-center gap-2">
          <input
            type="email"
            placeholder="Email Address"
            className="input input-bordered w-full max-w-sm bg-white text-black"
          />
          <button className="btn btn-primary">Get Started</button>
        </form>
      </div>
    </section>
  );
}
