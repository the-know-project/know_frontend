import { Coins } from "lucide-react";

const ArtistSalesStats = () => {
  return (
    <section className="flex w-full flex-col py-14">
      <div className="mb-6 flex items-center gap-8">
        <div className="rounded-full bg-orange-100 p-2">
          <Coins className="h-5 w-5 text-orange-500" />
        </div>
        <h2 className="stats_title">Earnings</h2>
      </div>
    </section>
  );
};

export default ArtistSalesStats;
