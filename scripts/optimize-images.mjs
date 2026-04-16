import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const imageDir = "public/images";
const maxWidth = 800;
const quality = 82;

const files = await readdir(imageDir);
for (const file of files) {
  if (!file.endsWith(".png")) continue;
  const src = join(imageDir, file);
  const dst = join(imageDir, file.replace(/\.png$/, ".webp"));
  const before = (await stat(src)).size;
  const metadata = await sharp(src).metadata();
  const width = Math.min(metadata.width ?? maxWidth, maxWidth);
  await sharp(src).resize({ width }).webp({ quality }).toFile(dst);
  const after = (await stat(dst)).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file} → ${file.replace(".png", ".webp")}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${saved}%)`);
}
