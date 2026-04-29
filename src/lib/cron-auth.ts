import { timingSafeEqual } from "node:crypto";

/**
 * Cron系エンドポイントのAuthorizationヘッダ検証。
 * timing-safe比較で文字一致タイミングからのシークレット推測を防ぐ。
 */
export function isCronRequestAuthorized(
  authHeader: string | null,
  secret: string | undefined,
): boolean {
  if (!secret) return false;
  if (!authHeader) return false;
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
