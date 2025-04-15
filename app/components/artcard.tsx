import Image from "next/image";

interface ArtCardProps {
  image: string;
  title: string;
  artist: string;
  likes: number;
  avatar: string;
}

export default function ArtCard({ image, title, artist, likes, avatar }: ArtCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-video w-full relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src={avatar} alt={artist} width={24} height={24} className="rounded-full" />
          <p className="text-sm font-medium">{artist}</p>
        </div>
        <p className="text-sm text-neutral-600">{likes.toLocaleString()} likes</p>
      </div>
    </div>
  );
}
