import { Redis } from "@upstash/redis";

// Vercel Marketplace統合で自動設定される環境変数の複数パターンに対応。
// 優先度順:
//   1. UPSTASH_REDIS_REST_URL / TOKEN
//   2. KV_REST_API_URL / TOKEN
//   3. STORAGE_UPSTASH_REDIS_REST_URL / TOKEN
//   4. STORAGE_KV_REST_API_URL / TOKEN
export function getRedis(): Redis | null {
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

export const redis = getRedis();
