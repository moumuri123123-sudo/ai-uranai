import { GoogleGenAI } from "@google/genai";
import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";

// Vercel Cronの最大実行時間を設定（デフォルト10秒だとGemini生成が間に合わない場合がある）
export const maxDuration = 60;

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
// 今日の星座を取得（太陽星座の期間に基づく）
function getTodayZodiac(): { name: string; period: string } {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const zodiacs = [
    { name: "やぎ座", period: "12/22-1/19" },
    { name: "みずがめ座", period: "1/20-2/18" },
    { name: "うお座", period: "2/19-3/20" },
    { name: "おひつじ座", period: "3/21-4/19" },
    { name: "おうし座", period: "4/20-5/20" },
    { name: "ふたご座", period: "5/21-6/21" },
    { name: "かに座", period: "6/22-7/22" },
    { name: "しし座", period: "7/23-8/22" },
    { name: "おとめ座", period: "8/23-9/22" },
    { name: "てんびん座", period: "9/23-10/23" },
    { name: "さそり座", period: "10/24-11/22" },
    { name: "いて座", period: "11/23-12/21" },
  ];
  const md = month * 100 + day;
  if (md >= 1222 || md <= 119) return zodiacs[0];
  if (md <= 218) return zodiacs[1];
  if (md <= 320) return zodiacs[2];
  if (md <= 419) return zodiacs[3];
  if (md <= 520) return zodiacs[4];
  if (md <= 621) return zodiacs[5];
  if (md <= 722) return zodiacs[6];
  if (md <= 822) return zodiacs[7];
  if (md <= 922) return zodiacs[8];
  if (md <= 1023) return zodiacs[9];
  if (md <= 1122) return zodiacs[10];
  return zodiacs[11];
}

async function generateFortune(): Promise<string> {
  if (!ai) {
    return "おひつじ座さん、今日は直感を信じて。きっといいことがあるよ。";
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Tokyo",
  });
  const zodiac = getTodayZodiac();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `今日は${today}です。今日の星座は${zodiac.name}（${zodiac.period}）です。この星座の人に向けた、ひとこと星占いを書いてください。`,
    config: {
      systemInstruction: `あなたは占処（うらないどころ）の占い師です。
毎朝Xに投稿する「ひとこと星占い」を書いてください。

【ルール】
- 全体で140文字以内（ハッシュタグ・URL除く）
- 「○○座さん、」で始める（○○は今日の星座）
- 友達に話しかけるようなカジュアルで親しみやすい口調
- 絵文字は使わない
- マークダウンは使わない
- 具体的で実践しやすいアドバイスを1つ含める
- 前向きで元気が出る内容にする`,
    },
  });

  return response.text?.trim() || "今日も素敵な一日になりますように。";
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
  // Cron認証チェック（Vercelが自動で Authorization: Bearer <CRON_SECRET> を付与）
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
    // お告げテキストを生成（画像はFree APIプランでは使えないため省略）
    const fortuneText = await generateFortune();

    const zodiac = getTodayZodiac();
    const tweetText = `${fortuneText}

#${zodiac.name} #今日の運勢 #占い #占処
https://uranaidokoro.com`;

    // テキストのみツイート（Free APIプランではv1 media uploadが使えない）
    const tweetResult = await twitter.v2.tweet({ text: tweetText });

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
      { error: "Failed to post tweet", detail: errorMessage, data: errorData },
      { status: 500 },
    );
  }
}
