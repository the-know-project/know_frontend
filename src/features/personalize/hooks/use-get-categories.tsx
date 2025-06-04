import { useQuery } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../queries/get-categories.queries";

export const useGetCategories = () => {
  return useQuery(getCategoriesQueryOptions);
};
