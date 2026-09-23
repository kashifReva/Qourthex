// next/image does not automatically prepend `basePath` to `src` when
// `images.unoptimized` is true (required for static export), so every
// static asset path needs to go through this helper instead.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
