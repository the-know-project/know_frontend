import { AxiosError } from "axios";

export function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          `Server error: ${error.response.status}`,
      );
    } else if (error.request) {
      throw new Error("Network error: No response from server");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}
