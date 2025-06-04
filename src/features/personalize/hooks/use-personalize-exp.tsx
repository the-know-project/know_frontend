import { useMutation } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { personalizeExperience } from "../api/prefrences/route";
import { PersonalizeResponseDto } from "../dto/personalize.dto";

export const usePersonalizeExp = () => {
  const user = useTokenStore((state) => state.user);

  if (!user) {
    window.location.href = "/login";
  }

  return useMutation({
    mutationFn: async (data: string[]) => {
      const result = await personalizeExperience({
        userId: user?.id as string,
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
