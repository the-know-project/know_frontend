import { IconTrendingUp } from "@tabler/icons-react";
import { StaticImageData } from "next/image";
import Image from "next/image";

interface IPostPerformance {
  id: string;
  title: string;
  published: string;
  src: string | StaticImageData;
  views: number;
  totalLikes: number;
  totalSales: number;
}

interface IArtistPostPerformance {
  posts: IPostPerformance[];
}

const ArtistPerformance: React.FC<IArtistPostPerformance> = ({ posts }) => {
  return (
    <section className="flex w-full flex-col py-12">
      <div className="mb-6 flex items-center gap-8">
        <div className="rounded-full bg-orange-100 p-2">
          <IconTrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <h2 className="stats_title">Posts Performance</h2>
      </div>

      <div className="w-full">
        <div className="stats_content grid grid-cols-4 gap-6 pb-6 text-xs tracking-wider !uppercase">
          <div>POST</div>
          <div className="text-center">VIEWS</div>
          <div className="text-center">LIKES</div>
          <div className="text-center">SALES</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="motion-preset-blur-down motion-duration-300 grid grid-cols-4 items-center gap-6 py-4"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Post Column */}
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={post.src}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bricolage hidden truncate text-lg font-semibold text-neutral-900 sm:block">
                    {post.title}
                  </h3>
                  <p className="stats_content hidden !text-sm capitalize md:block">
                    Published {post.published}
                  </p>
                </div>
              </div>

              {/* Views Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {post.views.toLocaleString()}
                </span>
              </div>

              {/* Likes Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {post.totalLikes.toLocaleString()}
                </span>
              </div>

              {/* Sales Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {post.totalSales.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ArtistPerformance;
