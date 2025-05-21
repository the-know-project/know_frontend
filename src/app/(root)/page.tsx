import Hero from "@/src/shared/components/hero";
import JoinCTA from "@/src/shared/components/joincta";
import TiltSection from "@/src/shared/components/tiltsection";
import Footer from "@/src/shared/layout/footer";
import Nav from "@/src/shared/layout/navbar";

export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <TiltSection
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc="/forArtist.png"
      />
      <TiltSection
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc="/forArtist.png"
        reverse
      />
      <TiltSection
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc="/forArtist.png"
      />
      <JoinCTA />
      <Footer />
    </div>
  );
}
