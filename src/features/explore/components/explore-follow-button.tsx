import { Button } from "@/src/shared/ui/button";
import { PlusCircle } from "lucide-react";

interface ExploreFollowButtonProps {
  artistId: string;
}

const ExploreFollowButton = ({ artistId }: ExploreFollowButtonProps) => {
  const handleFollow = () => {
    console.log("Following artist:", artistId);
    // TODO: Add logic to follow the artist
  };

  return (
    <Button className="font-bebas w-full cursor-pointer bg-[#1E3A8A] p-6 tracking-wider hover:bg-[#2c52ba]">
      <PlusCircle /> Follow
    </Button>
  );
};

export default ExploreFollowButton;
