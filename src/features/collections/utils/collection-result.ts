import { err, ok, ResultAsync } from "neverthrow";
import { CollectionsError } from "../error/collections.error";

interface StatusResponse {
  status: number;
}

export async function unwrapCollectionRequest<T extends StatusResponse>(
  request: Promise<T>,
  action: string,
  successStatuses: number[] = [200],
): Promise<T> {
  const result = await ResultAsync.fromPromise(
    request,
    (cause) =>
      new CollectionsError(
        `Failed to ${action}: ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
  ).andThen((response) =>
    successStatuses.includes(response.status)
      ? ok(response)
      : err(new CollectionsError(`Failed to ${action}`)),
  );

  if (result.isErr()) throw result.error;
  return result.value;
}
