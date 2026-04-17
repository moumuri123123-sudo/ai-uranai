import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
  daily?: boolean;
  remaining?: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const DAILY_LIMIT_MAX = 50;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Upstash Redis: 環境変数が設定されている場合のみ共有ストアで制限
// Vercel Marketplace統合ではプレフィックスが付く場合があるので複数パターンを確認。
// 対応するパターン（優先度順）:
//   1. UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//   2. KV_REST_API_URL / KV_REST_API_TOKEN
//   3. STORAGE_UPSTASH_REDIS_REST_URL / STORAGE_UPSTASH_REDIS_REST_TOKEN
//   4. STORAGE_KV_REST_API_URL / STORAGE_KV_REST_API_TOKEN
function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.STORAGE_UPSTASH_REDIS_REST_URL ||
    process.env.STORAGE_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.STORAGE_UPSTASH_REDIS_REST_TOKEN ||
    process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();

const minuteLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, "1 m"),
      analytics: false,
      prefix: "uranai:min",
    })
  : null;

const dailyLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_LIMIT_MAX, "1 d"),
      analytics: false,
      prefix: "uranai:day",
    })
  : null;

// ===== in-memory フォールバック =====
type Entry = { count: number; resetTime: number };
const minuteMap = new Map<string, Entry>();
const dailyMap = new Map<string, Entry>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, e] of minuteMap) if (now > e.resetTime) minuteMap.delete(k);
    for (const [k, e] of dailyMap) if (now > e.resetTime) dailyMap.delete(k);
  }, 60 * 1000);
}

function checkMemory(ip: string): RateLimitResult {
  const now = Date.now();

  const d = dailyMap.get(ip);
  if (d && now <= d.resetTime && d.count >= DAILY_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((d.resetTime - now) / 1000), daily: true, remaining: 0 };
  }

  let minuteCount: number;
  const m = minuteMap.get(ip);
  if (!m || now > m.resetTime) {
    minuteMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    minuteCount = 1;
  } else if (m.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((m.resetTime - now) / 1000), remaining: 0 };
  } else {
    m.count++;
    minuteCount = m.count;
  }

  if (!d || now > d.resetTime) {
    dailyMap.set(ip, { count: 1, resetTime: now + MS_PER_DAY });
  } else {
    d.count++;
  }

  return { allowed: true, remaining: Math.max(0, RATE_LIMIT_MAX - minuteCount) };
}

async function checkRedis(ip: string): Promise<RateLimitResult> {
  const day = await dailyLimiter!.limit(ip);
  if (!day.success) {
    const retryAfter = Math.max(1, Math.ceil((day.reset - Date.now()) / 1000));
    return { allowed: false, retryAfter, daily: true, remaining: 0 };
  }
  const min = await minuteLimiter!.limit(ip);
  if (!min.success) {
    const retryAfter = Math.max(1, Math.ceil((min.reset - Date.now()) / 1000));
    return { allowed: false, retryAfter, remaining: 0 };
  }
  return { allowed: true, remaining: min.remaining };
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (redis && minuteLimiter && dailyLimiter) {
    try {
      return await checkRedis(ip);
    } catch (err) {
      // Redis障害時はin-memoryにフォールバックして可用性を維持
      console.error("rate-limit redis error, falling back:", err);
      return checkMemory(ip);
    }
  }
  return checkMemory(ip);
}

export function isRedisBackend(): boolean {
  return redis !== null;
}
