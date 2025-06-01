import { login_asset, personalize_asset } from "@/src/assets";
import GridBackground from "@/src/shared/components/grid-background";
import Image from "next/image";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <section className="flex w-full flex-col">
      <GridBackground>
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
          <div className="flex w-full max-w-full flex-col px-8 py-12 md:px-16">
            <div className="w-full max-w-md">{children}</div>
          </div>
          <div className="motion-preset-blur-right-lg motion-duration-700 relative hidden md:block">
            <Image
              src={personalize_asset}
              alt="personalize_image"
              quality={100}
              fill
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </GridBackground>
    </section>
  );
};

export default Layout;
