// タロットカード裏面を gemini-3.1-flash-image で生成し、public/images/tarot/back.webp に保存。
// 使い方: node --env-file=.env.local scripts/gen-tarot-back.mjs

import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPT = `A vintage tarot card back design.

Style: Deep black background with intricate ornamental patterns in antique gold and a touch of crimson red. Retro Japanese fortune-telling aesthetic blended with classical Rider-Waite tarot. Mystical, vintage, slightly aged feel like an old card from the early 20th century.

Composition: Strictly symmetric design (mirrored along the vertical AND horizontal axis - the design must look identical when rotated 180 degrees, since tarot cards can be drawn upside down). Centered emblem featuring sacred geometry: a stylized sun-moon-star arrangement, or an all-seeing eye, or a pentagram inside a circle. Ornate art-nouveau filigree border framing the entire card edge with rounded corners. Subtle background texture suggesting old Japanese washi paper.

Strict requirements:
- NO text, NO letters, NO numbers, NO Chinese/Japanese characters - the design must be purely abstract decorative pattern
- Symmetric design that looks the same when rotated 180 degrees
- Card edge with elegantly rounded corners and a thin gold inner frame
- Refined, high-quality digital illustration with fine detailed lines

Inspiration: Rider-Waite tarot card backs, vintage Japanese omikuji slips, Art Nouveau occult illustrations.`;

const TARGET_WIDTH = 480;
const QUALITY = 85;
const outDir = path.join(process.cwd(), 'public', 'images', 'tarot');
const outPath = path.join(outDir, 'back.webp');

fs.mkdirSync(outDir, { recursive: true });

console.log('Generating with gemini-3.1-flash-image (9:16)...');
const t0 = Date.now();
const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image',
  contents: PROMPT,
  config: { imageConfig: { aspectRatio: '9:16' } },
});
console.log(`Generation done in ${Date.now() - t0}ms`);

const parts = response.candidates?.[0]?.content?.parts ?? [];
const imgPart = parts.find((p) => p.inlineData?.data);
if (!imgPart) {
  console.error('No image returned', response.promptFeedback?.blockReason ?? '');
  process.exit(1);
}

const pngBuffer = Buffer.from(imgPart.inlineData.data, 'base64');
await sharp(pngBuffer).resize({ width: TARGET_WIDTH }).webp({ quality: QUALITY }).toFile(outPath);

const size = fs.statSync(outPath).size;
console.log(`Saved: ${outPath} (${(size / 1024).toFixed(0)} KB)`);
