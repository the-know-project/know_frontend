import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { getCategories } from "../api/categories/get-categories/route";
import { PersonalizeErrorMessages } from "../data/personalize.data";
import { GetCategoriesResponseDto } from "../dto/personalize.dto";
import { IGetCategoriesResponseDto } from "../types/personalize.types";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        getCategories(),
        (error) => new Error(`Personalize error: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          const parsed = GetCategoriesResponseDto.parse(data);
          return ok(parsed);
        } else {
          return err(
            new Error(PersonalizeErrorMessages.FAILED_TO_FETCH_CATEGORIES),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as IGetCategoriesResponseDto;
    },
  });
};
