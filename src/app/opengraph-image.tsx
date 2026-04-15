import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "占処 AI占い";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        {/* 内枠 */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: "1px solid rgba(255,45,85,0.3)",
            borderRadius: 4,
            display: "flex",
          }}
        />

        {/* 装飾ライン左 */}
        <div
          style={{
            position: "absolute",
            top: 210,
            left: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />
        {/* 装飾ライン右 */}
        <div
          style={{
            position: "absolute",
            top: 210,
            right: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />

        {/* 星マーク上 */}
        <div
          style={{
            position: "absolute",
            top: 155,
            display: "flex",
            fontSize: 28,
            color: "#ffd700",
            opacity: 0.6,
          }}
        >
          &#x2726;
        </div>

        {/* メインタイトル */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: "#ffd700",
            textShadow: "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)",
            display: "flex",
            letterSpacing: "0.1em",
          }}
        >
          占処
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 42,
            color: "#f5e6d0",
            opacity: 0.9,
            letterSpacing: "0.15em",
            marginTop: -10,
            display: "flex",
          }}
        >
          AI占い師
        </div>

        {/* 説明 */}
        <div
          style={{
            fontSize: 22,
            color: "#f5e6d0",
            opacity: 0.5,
            letterSpacing: "0.2em",
            marginTop: 20,
            display: "flex",
          }}
        >
          タロット・星座・相性・MBTI
        </div>

        {/* 装飾ライン下左 */}
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />
        {/* 装飾ライン下右 */}
        <div
          style={{
            position: "absolute",
            bottom: 200,
            right: 200,
            width: 260,
            height: 1,
            background: "rgba(255,45,85,0.3)",
            display: "flex",
          }}
        />

        {/* 星マーク下 */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            display: "flex",
            fontSize: 20,
            color: "#ffd700",
            opacity: 0.4,
          }}
        >
          &#x2726;
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
