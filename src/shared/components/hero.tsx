import GradientText from "./gradient-text";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-between bg-black px-6 py-10 md:flex-row">
      <div className="max-w-xl">
        <h1 className="text-4xl leading-tight font-bold md:text-5xl">
          <GradientText
            colors={["#192c65", "#f97316", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="text-4xl leading-tight font-bold md:text-5xl"
          >
            Discover
          </GradientText>
          <span>Showcase.</span> <span>Own.</span>{" "}
        </h1>
        <p className="text-base-content mt-4">
          A blockchain-powered platform connecting artists and buyers like never
          before.
        </p>
        <button className="btn btn-warning mt-6">
          Join the movement
          <span className="ml-2">→</span>
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:mt-0 md:ml-10">
        <img
          src="/Art1.png"
          alt="Art 1"
          className="h-48 w-40 rounded-lg object-cover"
        />
        <img
          src="/Art2.png"
          alt="Art 2"
          className="h-48 w-40 rounded-lg object-cover"
        />
        <img
          src="/Art3.png"
          alt="Art 3"
          className="h-48 w-40 rounded-lg object-cover"
        />
        <img
          src="/Art4.png"
          alt="Art 4"
          className="h-48 w-40 rounded-lg object-cover"
        />
      </div>
    </section>
  );
}
