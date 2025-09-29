import { Button } from "@/src/shared/ui/button";
import { ShoppingCart } from "lucide-react";

const ExploreCheckoutButton = () => {
  return (
    <Button className="w-full cursor-pointer border border-gray-100 bg-transparent p-6 font-bold text-[#1E3A8A] hover:bg-transparent">
      <ShoppingCart /> Checkout
    </Button>
  );
};

export default ExploreCheckoutButton;
