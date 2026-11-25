import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { uploadAsset } from "../api/upload/route";
import { UploadResponseDto } from "../dto/upload.dto";
import { UploadError } from "../errors/upload.error";
import { IUploadAssetServer, IUploadAssetClient } from "../types/upload.types";
import { transformCustomMetadata } from "../utils/form-data.utils";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useUploadAsset = () => {
  const id = useTokenStore(selectUserId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [`upload-asset-${id}`],
    mutationFn: async (ctx: IUploadAssetClient) => {
      const { onProgress, ...uploadInput } = ctx;
      const serverData: IUploadAssetServer = {
        userId: id as string,
        fileName: uploadInput.fileName,
        description: uploadInput.description,
        asset: uploadInput.asset,
        size: uploadInput.size,
        categories: uploadInput.categories,
        tags: uploadInput.tags,
        customMetadata: uploadInput.customMetadata
          ? transformCustomMetadata(uploadInput.customMetadata)
          : undefined,
      };

      const result = await ResultAsync.fromPromise(
        uploadAsset(serverData, onProgress),
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
      void queryClient.invalidateQueries({
        queryKey: ["fetch-explore-asset"],
      });
      void queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${id}`],
      });
      void queryClient.invalidateQueries({
        queryKey: [`user-${id}-posts`],
      });
    },
  });
};
