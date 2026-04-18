import { generateOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "夢占いトレンド | 占処";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage(
    "夢占いトレンド",
    "今月みんなが見た夢のキーワード",
    "🌙",
  );
}
