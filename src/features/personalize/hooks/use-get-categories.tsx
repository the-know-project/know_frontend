import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories/get-categories/route";
import { GetCategoriesResponse } from "../dto/personalize.dto";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => {
      try {
        const result = await getCategories();
        const data = GetCategoriesResponse.parse(result);
        return data.data;
      } catch (error) {
        handleAxiosError(error);

        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      }
    },
  });
};
