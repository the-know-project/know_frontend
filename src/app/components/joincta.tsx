import Image from "next/image";

export default function JoinCTA() {
  return (
    <section className="relative bg-gradient-to-br from-[#0a0f3c] to-[#08104d] text-white px-6 py-20 overflow-hidden">
   
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[500px]  pointer-events-none flex justify-end pr-10">
       
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

     
      <div className="relative z-10  md:ml-11 max-w-3xl mx-auto ">
        <p className="text-sm uppercase text-neutral-300 mb-2">Ready to join?</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Showcase your talent or discover <br /> incredible art — start your journey today.
        </h2>

        <form className="flex items-center  justify-center gap-2 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Email Address"
            className="input input-bordered w-full max-w-sm text-black bg-white"
          />
          <button className="btn btn-primary">Get Started</button>
        </form>
      </div>
    </section>
  );
}
