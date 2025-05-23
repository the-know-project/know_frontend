import { for_artist, for_buyers, secure_tx } from "@/src/assets";
import TiltSection from "./tiltsection";

const About = () => {
  return (
    <section id="about" className="flex w-full flex-col scroll-smooth">
      <TiltSection
        role="For Artists"
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc={for_artist}
      />
      <TiltSection
        role="For Buyers"
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc={for_buyers}
        reverse
      />
      <TiltSection
        role="Secure Payments"
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc={secure_tx}
      />
    </section>
  );
};

export default About;
