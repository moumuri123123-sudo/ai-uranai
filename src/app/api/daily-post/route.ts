import { GoogleGenAI } from "@google/genai";
import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";

// Cron Jobからの呼び出しを認証するシークレット
const CRON_SECRET = process.env.CRON_SECRET;

// Gemini クライアント
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// X (Twitter) クライアント
function getTwitterClient() {
  const apiKey = (process.env.X_API_KEY || "").trim();
  const apiSecret = (process.env.X_API_SECRET || "").trim();
  const accessToken = (process.env.X_ACCESS_TOKEN || "").trim();
  const accessTokenSecret = (process.env.X_ACCESS_TOKEN_SECRET || "").trim();

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    return null;
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret: accessTokenSecret,
  });
}

// 今日のお告げテキストを生成
async function generateFortune(): Promise<string> {
  if (!ai) {
    return "今日も素敵な一日になりますように。心を開いて過ごしましょう。";
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Tokyo",
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `今日は${today}です。「今日のお告げ」として、占い師の口調で今日の運勢メッセージを書いてください。`,
    config: {
      systemInstruction: `あなたは占処（うらないどころ）の占い師です。
毎朝Xに投稿する「今日のお告げ」を書いてください。

【ルール】
- 140文字以内（ハッシュタグ・URL除く）
- 絵文字は使わない
- マークダウンは使わない
- 具体的なアドバイスを1つ含める
- ラッキーカラーまたはラッキーアイテムを1つ含める
- 前向きで温かみのある口調
- 「今日のお告げ」で始める`,
    },
  });

  return response.text?.trim() || "今日も素敵な一日になりますように。";
}

// 占い風の画像を生成
async function generateImage(): Promise<Buffer | null> {
  if (!ai) return null;

  const themes = [
    "神秘的なタロットカードが光る祭壇、キャンドルの灯り、占いの館",
    "星空の下に浮かぶ水晶玉、紫と金色の光、神秘的な雰囲気",
    "満月と和風の鳥居、夜空に浮かぶ星座、幻想的な風景",
    "古い占いの書物とタロットカード、レトロな雰囲気、暖かい光",
    "夜空に広がる星座と流れ星、宇宙の神秘、深い藍色の空",
    "和風の提灯と桜、夜の神社、神秘的で美しい雰囲気",
    "朝焼けの空と水晶、新しい一日の始まり、希望の光",
  ];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: `${theme}、日本のレトロな占い館の雰囲気、高品質、美しい色彩`,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
        outputMimeType: "image/png",
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      return Buffer.from(imageBytes, "base64");
    }
  } catch (e) {
    console.error("画像生成エラー:", e);
  }

  return null;
}

export async function POST(req: Request) {
  // Cron認証チェック
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twitter = getTwitterClient();
  if (!twitter) {
    return NextResponse.json(
      { error: "X API credentials not configured" },
      { status: 500 },
    );
  }

  try {
    // お告げテキストと画像を並行生成
    const [fortuneText, imageBuffer] = await Promise.all([
      generateFortune(),
      generateImage(),
    ]);

    const tweetText = `${fortuneText}

#占い #今日の運勢 #占処
https://uranaidokoro.com`;

    let tweetResult;

    if (imageBuffer) {
      // 画像付きツイート
      const mediaId = await twitter.v1.uploadMedia(imageBuffer, {
        mimeType: "image/png",
      });
      tweetResult = await twitter.v2.tweet({
        text: tweetText,
        media: { media_ids: [mediaId] },
      });
    } else {
      // テキストのみツイート
      tweetResult = await twitter.v2.tweet({ text: tweetText });
    }

    return NextResponse.json({
      success: true,
      tweetId: tweetResult.data.id,
      text: fortuneText,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    const errorData = (e as { data?: unknown })?.data;
    console.error("投稿エラー:", errorMessage, errorData);
    return NextResponse.json(
      { error: "Failed to post tweet", detail: errorMessage, data: errorData,
        debug: {
          hasApiKey: !!process.env.X_API_KEY,
          apiKeyLen: process.env.X_API_KEY?.length,
          hasApiSecret: !!process.env.X_API_SECRET,
          apiSecretLen: process.env.X_API_SECRET?.length,
          hasAccessToken: !!process.env.X_ACCESS_TOKEN,
          accessTokenLen: process.env.X_ACCESS_TOKEN?.length,
          hasAccessTokenSecret: !!process.env.X_ACCESS_TOKEN_SECRET,
          accessTokenSecretLen: process.env.X_ACCESS_TOKEN_SECRET?.length,
        }
      },
      { status: 500 },
    );
  }
}
