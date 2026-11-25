export function isImageKitUrl(source: string): boolean {
  try {
    return new URL(source).hostname === "ik.imagekit.io";
  } catch {
    return false;
  }
}
