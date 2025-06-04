import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { getCategories } from "../api/categories/get-categories/route";
import { GetCategoriesResponse } from "../dto/personalize.dto";

export const getCategoriesQuery = async () => {
  try {
    const result = await getCategories();
    const data = GetCategoriesResponse.parse(result);
    return data;
  } catch (error) {
    handleAxiosError(error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
};

export const getCategoriesQueryOptions = {
  queryKey: ["get-categories"],
  queryFn: getCategoriesQuery,
};
