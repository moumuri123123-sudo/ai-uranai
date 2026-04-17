import { redis } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";

// 日本語夢占いキーワードの簡易トークナイザ。
// 助詞や接続語などの一般語は除外し、2〜10文字の特徴語のみ記録する。
const STOP_WORDS = new Set([
  "の", "は", "を", "に", "が", "で", "と", "へ", "から", "まで", "より",
  "です", "ます", "する", "した", "して", "ある", "いる", "なる", "なった",
  "夢", "見た", "見る", "こと", "もの", "これ", "それ", "あれ", "どれ",
  "わたし", "私", "自分", "今日", "昨日", "今朝", "けれど", "そして", "でも",
  "けど", "よう", "みたい", "ような", "のような",
]);

// 漢字・ひらがな・カタカナの連続を抽出（英数字・句読点で分割）
function tokenize(input: string): string[] {
  const normalized = input.replace(/[\u3000\s]+/g, " ").trim();
  // 日本語文字のランを連続抽出
  const matches = normalized.match(/[\u4e00-\u9fff\u30a0-\u30ff\u3040-\u309f][\u4e00-\u9fff\u30a0-\u30ff\u3040-\u309fー々]*/g) || [];
  const tokens: string[] = [];
  for (const m of matches) {
    if (m.length < 2 || m.length > 10) continue;
    if (STOP_WORDS.has(m)) continue;
    tokens.push(m);
  }
  // 空白区切りのトークンも検査（カタカナ複数語など）
  for (const part of normalized.split(/\s+/)) {
    if (part.length < 2 || part.length > 10) continue;
    if (STOP_WORDS.has(part)) continue;
    if (!/^[\u4e00-\u9fff\u30a0-\u30ff\u3040-\u309fー々]+$/.test(part)) continue;
    tokens.push(part);
  }
  // 重複除去
  return [...new Set(tokens)];
}

function getJstMonthKey(): string {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getClientIp(req: Request): string {
  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) return vercelForwarded.split(",")[0].trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim() || "unknown";
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return "unknown";
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
    const keyword = typeof body.keyword === "string" ? body.keyword.slice(0, 200) : "";
    if (!keyword) {
      return Response.json({ error: "keyword required" }, { status: 400 });
    }
    const tokens = tokenize(keyword);
    if (tokens.length === 0) {
      return Response.json({ stored: 0 });
    }

    if (!redis) {
      return Response.json({ stored: 0, redis: false });
    }

    const monthKey = `dream:words:${getJstMonthKey()}`;
    // 各トークンをsorted setにインクリメント
    for (const token of tokens) {
      await redis.zincrby(monthKey, 1, token);
    }
    // 月キーを40日で自動期限切れ（月跨ぎでも残す）
    await redis.expire(monthKey, 40 * 24 * 60 * 60);

    return Response.json({ stored: tokens.length });
  } catch (err) {
    console.error("dream-words POST error:", err);
    return Response.json({ error: "記録に失敗しました。" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || getJstMonthKey();
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: "invalid month" }, { status: 400 });
  }

  if (!redis) {
    return Response.json({ month, words: [] });
  }

  try {
    const key = `dream:words:${month}`;
    // Upstash zrange with rev + withScores: 降順で上位取得
    const result = await redis.zrange<string[]>(key, 0, 29, { rev: true, withScores: true });
    const words: { word: string; count: number }[] = [];
    for (let i = 0; i < result.length; i += 2) {
      const w = String(result[i]);
      const c = Number(result[i + 1]);
      if (w && Number.isFinite(c)) words.push({ word: w, count: c });
    }
    return Response.json({ month, words });
  } catch (err) {
    console.error("dream-words GET error:", err);
    return Response.json({ month, words: [] });
  }
}
