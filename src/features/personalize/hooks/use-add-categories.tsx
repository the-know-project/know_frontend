import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { addCategories } from "../api/categories/add-categories/route";
import { AddCategoriesResponseDto } from "../dto/personalize.dto";
import { PersonalizeError } from "../errors/personalize.error";
import { IGetCategoriesResponseDto } from "../types/personalize.types";

export const useAddCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categories: string[]) => {
      const result = await ResultAsync.fromPromise(
        addCategories(categories),
        (error) =>
          new PersonalizeError(`Error adding categories: ${String(error)}`),
      ).andThen((response) => {
        const parsed = AddCategoriesResponseDto.safeParse(response);

        if (!parsed.success) {
          return err(
            new PersonalizeError("The server returned an invalid response"),
          );
        }

        if (parsed.data.status !== 200 && parsed.data.status !== 201) {
          return err(new PersonalizeError("Failed to add category"));
        }

        return ok(parsed.data);
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: async (response) => {
      queryClient.setQueryData<IGetCategoriesResponseDto>(
        ["get-categories"],
        (current) =>
          current
            ? {
                ...current,
                data: Array.from(new Set([...current.data, ...response.data])),
              }
            : current,
      );
      await queryClient.invalidateQueries({ queryKey: ["get-categories"] });
    },
  });
};
