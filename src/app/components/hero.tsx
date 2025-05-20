// components/Hero.tsx
import GradientText from '../Animation/GradientText'


export default function Hero() {
    return (
      <section className="flex bg-black flex-col md:flex-row justify-between items-center px-6 py-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <GradientText
  colors={["#192c65", "#f97316", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="text-4xl md:text-5xl font-bold leading-tight"
>
 Discover
</GradientText>
<span >Showcase.</span>{" "}
<span >Own.</span>{" "}
          </h1>
          <p className="mt-4 text-base-content">
            A blockchain-powered platform connecting artists and buyers like never before.
          </p>
          <button className="btn btn-warning mt-6">
            Join the movement
            <span className="ml-2">→</span>
          </button>
        </div>
  
        <div className="grid grid-cols-2 gap-4 mt-10 md:mt-0 md:ml-10">
          <img src="/Art1.png" alt="Art 1" className="w-40 h-48 object-cover rounded-lg" />
          <img src="/Art2.png" alt="Art 2" className="w-40 h-48 object-cover rounded-lg" />
          <img src="/Art3.png" alt="Art 3" className="w-40 h-48 object-cover rounded-lg" />
          <img src="/Art4.png" alt="Art 4" className="w-40 h-48 object-cover rounded-lg" />
        </div>
      </section>
    );
  }
  