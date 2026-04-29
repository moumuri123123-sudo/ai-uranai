import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import {
  generateArticlePromoTweet,
  generateTweetForSlot,
  markPromoTargetPosted,
  type TweetSlot,
} from "@/lib/auto-tweet";
import { isCronRequestAuthorized } from "@/lib/cron-auth";

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
  if (!isCronRequestAuthorized(authHeader, CRON_SECRET)) {
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

  // evening枠は記事/ページ紹介ツイート（blog 50記事＋夢占いトレンドからランダム、14日被り回避）
  // midday/night枠は従来通り占い豆知識ツイート
  const isPromoSlot = slot === "evening";
  let tweetText: string;
  let promoKey: string | null = null;
  if (isPromoSlot) {
    const promo = await generateArticlePromoTweet();
    tweetText = promo.text;
    promoKey = promo.key;
  } else {
    tweetText = await generateTweetForSlot(slot);
  }

  try {
    const result = await twitter.v2.tweet({ text: tweetText });
    // 投稿成功後にのみクールダウンを記録（投稿失敗時に被り回避から除外されないようにする）
    if (promoKey) {
      await markPromoTargetPosted(promoKey);
    }
    return NextResponse.json({
      success: true,
      tweetId: result.data.id,
      slot,
      type: isPromoSlot ? "article-promo" : "trivia",
      text: tweetText,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("auto-tweet error:", msg, (e as { data?: unknown })?.data);
    return NextResponse.json({ error: "Failed to post tweet" }, { status: 500 });
  }
}
