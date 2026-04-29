// ブログ記事のサムネイル画像を Imagen 4.0 で生成し、public/images/blog/{slug}.webp に保存。
//
// 使い方:
//   node --env-file=.env.local scripts/gen-blog-thumbs.mjs sample      # tarot/zodiac/dreamの3記事だけ生成
//   node --env-file=.env.local scripts/gen-blog-thumbs.mjs missing     # public/images/blog/に画像がない記事だけ生成（追加記事用）
//   node --env-file=.env.local scripts/gen-blog-thumbs.mjs all         # /tmp/blog_thumbs_gen/にPNGがない記事だけ生成（途中再開用）
//   node --env-file=.env.local scripts/gen-blog-thumbs.mjs only <slug> # 特定slugだけ再生成
//
// 出力:
//   - PNG中間: /tmp/blog_thumbs_gen/{slug}.png（残しておくと再実行時にスキップされる）
//   - WebP本体: public/images/blog/{slug}.webp（800x450, q=85, 16:9）

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TARGET_WIDTH = 800;
const QUALITY = 85;
const PNG_CACHE_DIR = "/tmp/blog_thumbs_gen";
const OUT_DIR = path.join(process.cwd(), "public", "images", "blog");
const THROTTLE_MS = 1500;

fs.mkdirSync(PNG_CACHE_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// blog-data.ts からslug/title/categoryを抽出（read-only）
const dataSrc = fs.readFileSync("src/lib/blog-data.ts", "utf-8");
const articles = [];
const objRe = /\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)"/g;
let m;
while ((m = objRe.exec(dataSrc)) !== null) {
  articles.push({ slug: m[1], title: m[2], category: m[3] });
}
console.log(`Parsed ${articles.length} articles from blog-data.ts`);

const CATEGORY_GUIDE = {
  tarot: "Feature stylized tarot cards arranged elegantly, mystical hands holding cards, sacred geometry, candlelight",
  zodiac: "Feature constellations and zodiac signs arranged across a starry sky, celestial bodies, planetary alignment",
  compatibility: "Feature two intertwined symbols (hearts, ribbons, threads of fate), paired harmonious patterns",
  mbti: "Feature a 16-piece geometric mosaic representing personality types, abstract balanced composition",
  dream: "Feature a surreal dreamscape with a floating moon, drifting clouds, gentle ethereal atmosphere, soft glow",
  numerology: "Feature sacred numbers, geometric patterns, ancient script-like glyphs, mathematical sigils",
  general: "Feature mystical divination tools (crystal ball, runes, candles), sacred occult symbols, ornate patterns",
};

function buildPrompt(article) {
  const guide = CATEGORY_GUIDE[article.category] ?? CATEGORY_GUIDE.general;
  return `A mystical fortune-telling blog thumbnail illustration, 16:9 horizontal landscape.

Topic: "${article.title}"
Theme: ${article.category}

Composition: ${guide}. Symbolic and atmospheric, centered around the topic. Refined editorial illustration suitable for a header image.

Style: Retro Japanese fortune-telling aesthetic blended with classical Western divination art. Deep dark navy/black background with antique gold and crimson red accents. Mystical, vintage, occult atmosphere with subtle Japanese washi paper texture. Soft glowing highlights.

Strict requirements:
- NO text, NO letters, NO numbers, NO Chinese/Japanese characters
- 16:9 horizontal landscape orientation
- Refined high-quality digital illustration
- Atmospheric professional editorial style
- Avoid: photorealistic faces, harsh contrast, cluttered composition`;
}

async function generateOne(article) {
  const pngPath = path.join(PNG_CACHE_DIR, `${article.slug}.png`);
  const webpPath = path.join(OUT_DIR, `${article.slug}.webp`);

  // PNGキャッシュがあれば再生成不要
  let pngBuffer;
  if (fs.existsSync(pngPath)) {
    pngBuffer = fs.readFileSync(pngPath);
  } else {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: buildPrompt(article),
      config: { numberOfImages: 1, aspectRatio: "16:9" },
    });
    const img = response.generatedImages?.[0];
    if (!img?.image?.imageBytes) {
      throw new Error(`no image returned${img?.raiFilteredReason ? " (RAI: " + img.raiFilteredReason + ")" : ""}`);
    }
    pngBuffer = Buffer.from(img.image.imageBytes, "base64");
    fs.writeFileSync(pngPath, pngBuffer);
  }

  await sharp(pngBuffer)
    .resize({ width: TARGET_WIDTH })
    .webp({ quality: QUALITY })
    .toFile(webpPath);

  return fs.statSync(webpPath).size;
}

const mode = process.argv[2] ?? "missing";
let targets;

if (mode === "sample") {
  const sampleSlugs = ["tarot-major-arcana-meanings", "zodiac-2026-horoscope", "dream-interpretation-guide"];
  targets = articles.filter((a) => sampleSlugs.includes(a.slug));
} else if (mode === "missing") {
  targets = articles.filter((a) => !fs.existsSync(path.join(OUT_DIR, `${a.slug}.webp`)));
} else if (mode === "all") {
  targets = articles.filter((a) => !fs.existsSync(path.join(PNG_CACHE_DIR, `${a.slug}.png`)));
} else if (mode === "only") {
  const slug = process.argv[3];
  if (!slug) {
    console.error("Usage: node scripts/gen-blog-thumbs.mjs only <slug>");
    process.exit(1);
  }
  targets = articles.filter((a) => a.slug === slug);
  if (targets.length === 0) {
    console.error(`Slug not found: ${slug}`);
    process.exit(1);
  }
  // only指定時はPNGキャッシュも無視して再生成
  for (const a of targets) {
    const p = path.join(PNG_CACHE_DIR, `${a.slug}.png`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
} else {
  console.error("Mode required: sample | missing | all | only <slug>");
  process.exit(1);
}

console.log(`Generating ${targets.length} thumbnails (mode: ${mode})...`);
let okCount = 0;
const errors = [];

for (let i = 0; i < targets.length; i++) {
  const a = targets[i];
  process.stdout.write(`[${i + 1}/${targets.length}] ${a.slug} ... `);
  const t0 = Date.now();
  try {
    const sz = await generateOne(a);
    console.log(`OK (${Date.now() - t0}ms, ${(sz / 1024).toFixed(0)}KB)`);
    okCount++;
  } catch (e) {
    console.log(`ERROR: ${e.message ?? e}`);
    errors.push({ slug: a.slug, reason: e.message ?? String(e) });
  }
  if (i < targets.length - 1) await new Promise((r) => setTimeout(r, THROTTLE_MS));
}

console.log(`\nDone: ${okCount}/${targets.length} OK`);
if (errors.length > 0) {
  console.log("Failures:", JSON.stringify(errors, null, 2));
  process.exit(1);
}
