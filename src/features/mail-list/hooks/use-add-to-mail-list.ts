import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { addToMailList } from "../api/route";
import {
  AddToMailListResponseDto,
  IAddToMailList,
} from "../schemas/email.schema";

export const useAddToMailList = () => {
  return useMutation({
    mutationFn: async (data: IAddToMailList) => {
      try {
        const result = await addToMailList(data);
        return AddToMailListResponseDto.parse(result);
      } catch (error) {
        handleAxiosError(error);

        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      }
    },
    onError: (error) => {
      console.error("Failed to add to mail list:", error);
    },
    onSuccess: (data) => {
      console.log("Successfully added to mail list:", data);
    },
  });
};
