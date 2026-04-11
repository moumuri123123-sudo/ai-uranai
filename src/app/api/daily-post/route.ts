import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";
import { formatRankingForTweet } from "@/lib/daily-ranking";

const CRON_SECRET = process.env.CRON_SECRET;

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
    const tweetText = formatRankingForTweet();
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
