import { GoogleGenAI } from "@google/genai";
import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";
import { formatRankingForTweet } from "@/lib/daily-ranking";

// Gemini生成に時間がかかる場合に備えて
export const maxDuration = 30;

const CRON_SECRET = process.env.CRON_SECRET;

// Gemini クライアント（1位の一言コメント生成用）
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

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

// Geminiで1位の一言コメントを生成
async function generateFirstPlaceComment(
  zodiacName: string,
): Promise<string | null> {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${zodiacName}が1位の日の一言コメントを書いてください。`,
      config: {
        systemInstruction: `あなたは占処（うらないどころ）の占い師です。
星座占いランキング1位の星座に添える一言コメントを書いてください。

【ルール】
- 15文字以内
- 「！」で終える
- 絵文字は使わない
- マークダウンは使わない
- 前向きでワクワクする内容
- 例：「直感が冴える一日！」「最高のツキが到来！」「恋に追い風の日！」`,
      },
    });

    const text = response.text?.trim();
    if (text && text.length <= 20) return text;
    return null;
  } catch {
    return null;
  }
}

// Vercel CronはGETリクエストを送る
export async function GET(req: Request) {
  return handleDailyPost(req);
}

// 手動テスト用にPOSTも残す
export async function POST(req: Request) {
  return handleDailyPost(req);
}

async function handleDailyPost(req: Request) {
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
    const tweetText = await formatRankingForTweet(generateFirstPlaceComment);
    const tweetResult = await twitter.v2.tweet({ text: tweetText });

    return NextResponse.json({
      success: true,
      tweetId: tweetResult.data.id,
      text: tweetText,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    const errorData = (e as { data?: unknown })?.data;
    console.error("投稿エラー:", errorMessage, errorData);
    return NextResponse.json(
      { error: "Failed to post tweet", detail: errorMessage, data: errorData },
      { status: 500 },
    );
  }
}
