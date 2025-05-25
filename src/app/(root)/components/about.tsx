import { for_artist, for_buyers, secure_tx } from "@/src/assets";
import TiltSection from "./tilt-section";

const About = () => {
  return (
    <section id="about" className="flex w-full flex-col scroll-smooth">
      <TiltSection
        role="For Artists"
        title="Showcase your work, manage your portfolio, and reach global buyers."
        subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
        imgSrc={for_artist}
        glow_color="purple-glow"
      />
      <TiltSection
        role="For Buyers"
        title="Discover unique art, express interest, and support artists worldwide."
        subtitle="From emerging talents to established artists, find unique art and foster a global creative community."
        imgSrc={for_buyers}
        reverse
        glow_color="orange-glow"
      />
      <TiltSection
        role="Secure Transactions"
        title="Safe and seamless payments with every transaction."
        subtitle="Enjoy the flexibility of paying in your preferred currency while benefiting from robust security measures that safeguard your financial data."
        imgSrc={secure_tx}
        glow_color="green-glow"
      />
    </section>
  );
};

export default About;
