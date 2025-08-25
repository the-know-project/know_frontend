import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTokenStore } from "../../auth/state/store";
import { personalizeExperience } from "../api/prefrences/route";
import { PersonalizeResponseDto } from "../dto/personalize.dto";

export const usePersonalizeExp = () => {
  const user = useTokenStore((state) => state.user);

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      window.location.href = "/login";
    }
  }, [user]);

  return useMutation({
    mutationFn: async (data: string[]) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await personalizeExperience({
        userId: user.id,
        categories: data,
      });

      const validatedData = PersonalizeResponseDto.parse(result);
      return validatedData;
    },
    onSuccess: () => {
      console.log("Personalization successful");
    },
    onError: (error) => {
      console.error("Personalization failed:", error);
    },
  });
};
