import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import {
  generateTweetForSlot,
  getDreamTrendsTweet,
  shouldPromoteDreamTrends,
  type TweetSlot,
} from "@/lib/auto-tweet";

export const maxDuration = 30;

const CRON_SECRET = process.env.CRON_SECRET;

function isValidSlot(s: unknown): s is TweetSlot {
  return s === "midday" || s === "evening" || s === "night";
}

function getTwitterClient(): TwitterApi | null {
  const apiKey = (process.env.X_API_KEY || "").trim();
  const apiSecret = (process.env.X_API_SECRET || "").trim();
  const accessToken = (process.env.X_ACCESS_TOKEN || "").trim();
  const accessTokenSecret = (process.env.X_ACCESS_TOKEN_SECRET || "").trim();
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) return null;
  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret: accessTokenSecret,
  });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slot = searchParams.get("slot");
  if (!isValidSlot(slot)) {
    return NextResponse.json({ error: "invalid slot" }, { status: 400 });
  }

  const twitter = getTwitterClient();
  if (!twitter) {
    return NextResponse.json(
      { error: "X API credentials not configured" },
      { status: 500 },
    );
  }

  // evening枠かつ3日周期の日は夢占いトレンド宣伝ツイートに差し替え
  const useDreamPromo = slot === "evening" && shouldPromoteDreamTrends();
  const tweetText = useDreamPromo
    ? getDreamTrendsTweet()
    : await generateTweetForSlot(slot);

  try {
    const result = await twitter.v2.tweet({ text: tweetText });
    return NextResponse.json({
      success: true,
      tweetId: result.data.id,
      slot,
      type: useDreamPromo ? "dream-trends-promo" : "original",
      text: tweetText,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("auto-tweet error:", msg, (e as { data?: unknown })?.data);
    return NextResponse.json({ error: "Failed to post tweet" }, { status: 500 });
  }
}
