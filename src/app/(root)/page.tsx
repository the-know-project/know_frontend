import Footer from "@/src/shared/layout/footer";
import Nav from "@/src/shared/layout/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import JoinCTA from "./components/joincta";

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
