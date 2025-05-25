import About from "@/src/shared/components/about";
import Hero from "@/src/shared/components/hero";
import JoinCTA from "@/src/shared/components/joincta";
import Footer from "@/src/shared/layout/footer";
import Nav from "@/src/shared/layout/navbar";

export default function Home() {
  return (
    <>
      <div className="relative">
        <div className="absolute w-full">
          <Nav />
        </div>
        <Hero />
      </div>
      <About />
      <JoinCTA />
      <Footer />
    </>
  );
}
