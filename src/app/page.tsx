import Footer from "./components/footer";
import Header from "./components/header"
import Hero from "./components/hero";
import JoinCTA from "./components/joincta";
import TiltSection from "./components/tiltsection";


export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
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
      <JoinCTA/>
      <Footer/>

    </div>
  );
}
