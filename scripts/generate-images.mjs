import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const outputDir = path.join(process.cwd(), "public", "images");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
  {
    name: "hero-bg.png",
    prompt: "A mysterious Japanese fortune-telling parlor interior, dark moody atmosphere with warm golden lantern light, red neon glow, vintage wooden door slightly open revealing mystical light, no text, no people, cinematic wide shot, 16:9 aspect ratio",
  },
  {
    name: "tarot.png",
    prompt: "A single tarot card face down on a dark velvet cloth, mystical red glow around it, golden ornate border on the card, dark moody atmosphere, no text, no people, centered composition",
  },
  {
    name: "zodiac.png",
    prompt: "A beautiful night sky full of stars with constellation lines connected, golden star trails, deep dark blue and purple cosmos, no text, no people, mystical astronomy illustration",
  },
  {
    name: "compatibility.png",
    prompt: "Two glowing red threads of fate intertwined, dark background with soft golden sparkles, Japanese mystical aesthetic, romantic and mysterious atmosphere, no text, no people",
  },
  {
    name: "mbti.png",
    prompt: "A mystical mirror reflecting multiple personality silhouettes, dark moody background with neon purple and gold accents, psychological and mysterious atmosphere, no text, no people",
  },
  {
    name: "dream.png",
    prompt: "A surreal dreamscape with floating clouds and a crescent moon, soft purple and blue tones, stars and sparkles, ethereal and mystical atmosphere, Japanese fantasy art style, no text, no people",
  },
  {
    name: "numerology.png",
    prompt: "Sacred geometry patterns with golden numbers floating in dark space, mystical mathematical symbols, dark background with gold and red neon accents, no text except abstract number shapes, no people",
  },
];

async function generateImage(item) {
  console.log(`Generating: ${item.name}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: `Generate a high quality image: ${item.prompt}`,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data, "base64");
          const filePath = path.join(outputDir, item.name);
          fs.writeFileSync(filePath, buffer);
          console.log(`  Saved: ${filePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
          return true;
        }
      }
    }
    console.log(`  Warning: No image data in response for ${item.name}`);
    return false;
  } catch (err) {
    console.error(`  Error generating ${item.name}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("Starting image generation...\n");
  let success = 0;
  for (const item of images) {
    const result = await generateImage(item);
    if (result) success++;
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log(`\nDone! ${success}/${images.length} images generated.`);
}

main();
