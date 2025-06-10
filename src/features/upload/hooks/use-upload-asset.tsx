import { useMutation } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { uploadAsset } from "../api/upload/route";
import { UploadResponseDto } from "../dto/upload.dto";
import { UploadError } from "../errors/upload.error";
import { IUploadAsset } from "../types/upload.types";

export const useUploadAsset = () => {
  const id = useTokenStore((state) => state.user?.id);
  return useMutation({
    mutationKey: [`upload-asset-${id}`],
    mutationFn: async (ctx: IUploadAsset) => {
      const serverData = {
        id: id!,
        fileName: ctx.fileName,
        asset: ctx.asset,
        size: ctx.size,
        categories: ctx.categories,
        tags: ctx.tags,
        customMetadata: ctx.customMetadata,
      };

      const result = await ResultAsync.fromPromise(
        uploadAsset(serverData),
        (error) => new UploadError(`Upload failed: ${error}`),
      ).andThen((response) => {
        const parseResult = UploadResponseDto.safeParse(response);
        if (parseResult.success) {
          return ok(parseResult.data);
        } else {
          return err(new UploadError("Invalid response format"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      // Invalidate art explorer query
      // queryClient.invalidateQueries({ queryKey: ["your-query-key"] });
    },
  });
};
