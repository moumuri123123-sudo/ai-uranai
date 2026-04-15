import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function generateOgImage(title: string, subtitle: string, emoji: string) {
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
          background: "linear-gradient(135deg, #0a0408 0%, #1a0a12 50%, #0a0408 100%)",
          position: "relative",
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
            border: "2px solid #ff2d55",
            borderRadius: 8,
            display: "flex",
            boxShadow: "0 0 30px rgba(255,45,85,0.3), inset 0 0 30px rgba(255,45,85,0.1)",
          }}
        />

        {/* 装飾ライン上 */}
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 160,
            right: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />

        {/* 絵文字 */}
        <div
          style={{
            fontSize: 80,
            display: "flex",
            marginBottom: 10,
          }}
        >
          {emoji}
        </div>

        {/* タイトル */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffd700",
            textShadow: "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)",
            display: "flex",
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 32,
            color: "#f5e6d0",
            opacity: 0.8,
            letterSpacing: "0.15em",
            marginTop: 10,
            display: "flex",
          }}
        >
          {subtitle}
        </div>

        {/* 占処ロゴ */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#ffd700",
              opacity: 0.5,
              display: "flex",
            }}
          >
            &#x2726;
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#f5e6d0",
              opacity: 0.5,
              letterSpacing: "0.2em",
              display: "flex",
            }}
          >
            占処 AI占い
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#ffd700",
              opacity: 0.5,
              display: "flex",
            }}
          >
            &#x2726;
          </div>
        </div>

        {/* 装飾ライン下 */}
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 130,
            right: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...ogSize,
      headers: {
        "cache-control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
