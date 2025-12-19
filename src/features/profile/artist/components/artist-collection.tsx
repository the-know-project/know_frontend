import { IconCirclePlus } from "@tabler/icons-react";
import Collections from "./collections";

const ArtistCollection = () => {
  return (
    <section className="relative -mt-[50px] flex w-full flex-col">
      <div className="overflow-x-hidden">
        <Collections />
      </div>
      <div className="sticky bottom-5 z-50 w-fit self-end">
        <div className="rounded-3xl bg-transparent p-2 shadow-lg backdrop-blur-2xl">
          <IconCirclePlus
            width={50}
            height={50}
            className="text-neutral-600 transition-all duration-300 hover:text-blue-800"
          />
        </div>
      </div>
    </section>
  );
};

export default ArtistCollection;
