import { CartButton } from "@/src/features/cart/components";
import Image from "next/image";

// This would come from your API
const products = [
  { id: "file-1", title: "Artwork 1", price: 99.99, image: "/art1.jpg" },
  { id: "file-2", title: "Artwork 2", price: 149.99, image: "/art2.jpg" },
  { id: "file-3", title: "Artwork 3", price: 79.99, image: "/art3.jpg" },
];

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Explore Artworks</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600">${product.price}</p>

        {/* Cart Button */}
        <CartButton fileId={product.id} variant="button" className="w-full" />
      </div>
    </div>
  );
}
