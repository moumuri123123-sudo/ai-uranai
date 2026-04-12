import { generateOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "今日の運勢ランキング | 占処";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage("運勢ランキング", "12星座の今日の運勢は？", "🏆");
}
