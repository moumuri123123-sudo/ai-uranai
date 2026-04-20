import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blog-data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "占処 コラム記事";

// カテゴリごとのアクセントカラー（og-result と揃える）
const accentByCategory: Record<string, string> = {
  tarot: "#ff2d55",
  zodiac: "#ffd700",
  compatibility: "#ff69b4",
  mbti: "#00ddff",
  dream: "#884898",
  numerology: "#f0a030",
  general: "#ffd700",
};

// 長いタイトルは書記素単位で切り詰める（絵文字・サロゲート対応）
function truncateGraphemes(text: string, max: number): string {
  const normalized = text.normalize("NFC");
  const chars = Array.from(normalized);
  if (chars.length <= max) return normalized;
  return chars.slice(0, max - 1).join("") + "…";
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = truncateGraphemes(article?.title ?? "占処 コラム", 40);
  const emoji = article?.emoji ?? "占";
  const accent = accentByCategory[article?.category ?? "general"] ?? "#ffd700";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0408 0%, #1a0a12 50%, #0a0408 100%)",
          position: "relative",
          padding: 60,
        }}
      >
        {/* 外枠 */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: `2px solid ${accent}`,
            borderRadius: 8,
            display: "flex",
            boxShadow: `0 0 30px ${accent}4d, inset 0 0 30px ${accent}1a`,
          }}
        />
        {/* 内枠 */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: `1px solid ${accent}4d`,
            borderRadius: 4,
            display: "flex",
          }}
        />

        {/* 上部ラベル */}
        <div
          style={{
            fontSize: 22,
            color: "#c8a882",
            letterSpacing: "0.3em",
            marginBottom: 30,
            display: "flex",
          }}
        >
          占処 コラム
        </div>

        {/* 漢字エンブレム */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: `2px solid ${accent}80`,
            color: accent,
            fontSize: 52,
            marginBottom: 32,
            boxShadow: `0 0 24px ${accent}40`,
          }}
        >
          {emoji}
        </div>

        {/* 記事タイトル */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffd700",
            textShadow:
              "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.25)",
            letterSpacing: "0.04em",
            lineHeight: 1.35,
            textAlign: "center",
            display: "flex",
            maxWidth: 1000,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {title}
        </div>

        {/* 下部装飾ライン */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 100,
              height: 1,
              background: `${accent}4d`,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: accent,
              opacity: 0.7,
              display: "flex",
            }}
          >
            &#x2726;
          </div>
          <div
            style={{
              width: 100,
              height: 1,
              background: `${accent}4d`,
              display: "flex",
            }}
          />
        </div>

        {/* サイト名 */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            fontSize: 18,
            color: "#f5e6d0",
            opacity: 0.55,
            letterSpacing: "0.25em",
            display: "flex",
          }}
        >
          uranaidokoro.com
        </div>
      </div>
    ),
    size,
  );
}
