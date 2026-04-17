import { redis } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";

// 共感度スタンプの種類
export const STAMPS = ["resonated", "insight", "encouraged"] as const;
export type Stamp = (typeof STAMPS)[number];

const VALID_FORTUNE_TYPES = ["tarot", "zodiac", "compatibility", "mbti", "dream", "numerology", "daily"];

function getClientIp(req: Request): string {
  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) return vercelForwarded.split(",")[0].trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim() || "unknown";
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return "unknown";
}

function isValidStamp(s: unknown): s is Stamp {
  return typeof s === "string" && (STAMPS as readonly string[]).includes(s);
}

function isValidFortuneType(s: unknown): s is string {
  return typeof s === "string" && VALID_FORTUNE_TYPES.includes(s);
}

// カウンター取得（Redis未設定時は全て0）
async function getCounts(fortuneType: string): Promise<Record<Stamp, number>> {
  const result: Record<Stamp, number> = { resonated: 0, insight: 0, encouraged: 0 };
  if (!redis) return result;
  try {
    const keys = STAMPS.map((s) => `vote:count:${fortuneType}:${s}`);
    const values = await redis.mget<(number | null)[]>(...keys);
    STAMPS.forEach((s, i) => {
      result[s] = Number(values[i] ?? 0);
    });
  } catch (err) {
    console.error("vote getCounts error:", err);
  }
  return result;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fortuneType = searchParams.get("fortuneType") ?? "";
  if (!isValidFortuneType(fortuneType)) {
    return Response.json({ error: "invalid fortuneType" }, { status: 400 });
  }
  const counts = await getCounts(fortuneType);
  return Response.json({ counts });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = await checkRateLimit(ip);
    if (!rate.allowed) {
      return Response.json(
        { error: "リクエストが多すぎます。" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter ?? 60) } },
      );
    }

    const body = await req.json();
    if (!isValidFortuneType(body.fortuneType)) {
      return Response.json({ error: "invalid fortuneType" }, { status: 400 });
    }
    if (!isValidStamp(body.stamp)) {
      return Response.json({ error: "invalid stamp" }, { status: 400 });
    }
    const voterId = typeof body.voterId === "string" ? body.voterId.slice(0, 64) : "";
    if (!voterId || !/^[a-zA-Z0-9_-]+$/.test(voterId)) {
      return Response.json({ error: "invalid voterId" }, { status: 400 });
    }

    if (!redis) {
      // Redis未設定時はクライアント側のlocalStorageで完結させ200返却
      return Response.json({ counts: { resonated: 0, insight: 0, encouraged: 0 }, stored: false });
    }

    // 24時間内に同じ占い種別×同じvoterId×同じスタンプの重複投票を禁止
    const dedupKey = `vote:dedup:${body.fortuneType}:${voterId}:${body.stamp}`;
    const setResult = await redis.set(dedupKey, "1", { nx: true, ex: 24 * 60 * 60 });
    if (setResult === null) {
      const counts = await getCounts(body.fortuneType);
      return Response.json({ counts, duplicate: true, stored: true });
    }

    const countKey = `vote:count:${body.fortuneType}:${body.stamp}`;
    await redis.incr(countKey);

    const counts = await getCounts(body.fortuneType);
    return Response.json({ counts, stored: true });
  } catch (err) {
    console.error("vote POST error:", err);
    return Response.json({ error: "投票に失敗しました。" }, { status: 500 });
  }
}
