import { generateOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "相性占い | 占処";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage("相性占い", "二人の運命の糸を読み解く", "💕");
}
