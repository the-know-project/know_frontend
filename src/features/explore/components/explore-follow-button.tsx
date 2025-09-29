import { Button } from "@/src/shared/ui/button";
import { PlusCircle } from "lucide-react";

const ExploreFollowButton = () => {
  return (
    <Button className="w-full cursor-pointer bg-[#1E3A8A] p-6 hover:bg-[#2c52ba]">
      <PlusCircle /> Follow
    </Button>
  );
};

export default ExploreFollowButton;
