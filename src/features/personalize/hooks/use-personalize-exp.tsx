import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTokenStore } from "../../auth/state/store";
import { personalizeExperience } from "../api/prefrences/route";
import { PersonalizeResponseDto } from "../dto/personalize.dto";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { err, ok, ResultAsync } from "neverthrow";
import { PersonalizeError } from "../errors/personalize.error";
import { IPersonalize } from "../types/personalize.types";

export const usePersonalizeExp = () => {
  const user = useTokenStore(selectUser);

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

      const result = await ResultAsync.fromPromise(
        personalizeExperience({
          categories: data,
        }),
        (error) =>
          new PersonalizeError(`Error personalizing experience: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          const parsed = PersonalizeResponseDto.parse(data);
          return ok(parsed);
        } else {
          return err(new PersonalizeError("Failed to personalize experience"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      console.log("Personalization successful");
    },
    onError: (error) => {
      console.error("Personalization failed:", error);
    },
  });
};
