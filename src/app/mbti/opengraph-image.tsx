import { generateOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "MBTI®性格診断 | 占処";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage("MBTI®診断", "16タイプで読み解くあなたの本質", "🧠");
}
