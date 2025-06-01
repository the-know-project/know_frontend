import { HomePageGuard } from "@/src/features/auth/guards";
import Footer from "@/src/shared/layout/footer";
import Nav from "@/src/shared/layout/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import JoinCTA from "./components/joincta";
import Faq from "./components/faq";
import Hero from "./components/hero";
import JoinCTA from "./components/joincta";

export default function Home() {
  return (
    <HomePageGuard>
      <div className="relative">
        <div className="absolute w-full">
          <Nav />
        </div>
        <Hero />
      </div>
      <About />
      <JoinCTA />
      <Faq />
      <Footer />
    </HomePageGuard>
  );
}
