import { old_sage, security, smoke_rose } from "@/src/assets";
import TiltSection from "./tilt-section";
import GridBackground from "@/src/shared/components/grid-background";
import Intro from "./intro";

const About = () => {
  return (
    <section id="about" className="flex w-full flex-col scroll-smooth">
      <GridBackground>
        <>
          <Intro />

          <TiltSection
            role="For Artists"
            title="Showcase your work, manage your portfolio, and reach global buyers."
            subtitle="Showcase your unique creations, manage a professional portfolio with ease, and connect with a global audience."
            imgSrc={smoke_rose}
            glow_color="animated-purple-glow"
          />
          <TiltSection
            role="For Buyers"
            title="Discover unique art, express interest, and support artists worldwide."
            subtitle="From emerging talents to established artists, find unique art and foster a global creative community."
            imgSrc={old_sage}
            reverse
            glow_color="animated-orange-glow"
          />
          <TiltSection
            role="Secure Transactions"
            title="Safe and seamless payments with every transaction."
            subtitle="Enjoy the flexibility of paying in your preferred currency while benefiting from robust security measures that safeguard your financial data."
            imgSrc={security}
            glow_color="animated-blue-glow"
          />
        </>
      </GridBackground>
    </section>
  );
};

export default About;
