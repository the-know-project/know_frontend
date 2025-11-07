import { Button } from "@/src/shared/ui/button";
import { ShoppingCart } from "lucide-react";

interface ExploreCheckoutButtonProps {
  artworkId: string;
}

const ExploreCheckoutButton = ({ artworkId }: ExploreCheckoutButtonProps) => {
  const handleCheckout = () => {
    console.log("Adding artwork to checkout:", artworkId);
    // TODO: Add logic to handle checkout/add to cart
  };

  return (
    <Button
      onClick={handleCheckout}
      className="w-full cursor-pointer border border-gray-100 bg-transparent p-6 font-bold text-[#1E3A8A] hover:bg-transparent"
    >
      <ShoppingCart /> Checkout
    </Button>
  );
};

export default ExploreCheckoutButton;
