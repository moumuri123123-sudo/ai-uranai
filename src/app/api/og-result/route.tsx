import { ImageResponse } from "next/og";
import {
  fortuneTypeNames,
  fortuneTypeIcons,
  isValidFortuneType,
} from "@/lib/share-utils";
import type { FortuneType } from "@/lib/share-utils";

export const runtime = "edge";

const accentColors: Record<FortuneType, string> = {
  tarot: "#ff2d55",
  zodiac: "#ffd700",
  compatibility: "#ff69b4",
  mbti: "#00ddff",
  dream: "#884898",
  numerology: "#f0a030",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type") || "";
  // 絵文字やサロゲートペアを壊さないようNFC正規化→書記素単位で切り詰める
  const rawLabel = (searchParams.get("label") || "占い結果").normalize("NFC");
  const label = Array.from(rawLabel).slice(0, 30).join("");
  const rawSummary = (searchParams.get("summary") || "").normalize("NFC");
  const summary = Array.from(rawSummary).slice(0, 80).join("");

  const type: FortuneType = isValidFortuneType(rawType) ? rawType : "tarot";
  const typeName = fortuneTypeNames[type];
  const icon = fortuneTypeIcons[type];
  const accent = accentColors[type];

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

        {/* 漢字アイコン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: `2px solid ${accent}80`,
            color: accent,
            fontSize: 32,
            marginBottom: 16,
            boxShadow: `0 0 20px ${accent}33`,
          }}
        >
          {icon}
        </div>

        {/* 占いタイプ名 */}
        <div
          style={{
            fontSize: 24,
            color: "#f5e6d0",
            opacity: 0.8,
            letterSpacing: "0.15em",
            marginBottom: 20,
            display: "flex",
          }}
        >
          {typeName}
        </div>

        {/* 装飾ライン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 120,
              height: 1,
              background: `${accent}4d`,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: "#ffd700",
              opacity: 0.5,
              display: "flex",
            }}
          >
            &#x2726;
          </div>
          <div
            style={{
              width: 120,
              height: 1,
              background: `${accent}4d`,
              display: "flex",
            }}
          />
        </div>

        {/* メインラベル（カード名・星座名など） */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffd700",
            textShadow:
              "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)",
            letterSpacing: "0.05em",
            marginBottom: 24,
            display: "flex",
          }}
        >
          {label}
        </div>

        {/* 要約テキスト */}
        {summary && (
          <div
            style={{
              fontSize: 20,
              color: "#f5e6d0",
              opacity: 0.75,
              maxWidth: 800,
              textAlign: "center",
              lineHeight: 1.6,
              letterSpacing: "0.02em",
              display: "flex",
              paddingLeft: 60,
              paddingRight: 60,
            }}
          >
            {summary}
          </div>
        )}

        {/* 下部装飾ライン */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 1,
              background: `${accent}33`,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: "#ffd700",
              opacity: 0.4,
              display: "flex",
            }}
          >
            &#x2726;
          </div>
          <div
            style={{
              width: 80,
              height: 1,
              background: `${accent}33`,
              display: "flex",
            }}
          />
        </div>

        {/* サイト名 */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            fontSize: 16,
            color: "#ffd700",
            opacity: 0.4,
            letterSpacing: "0.2em",
            display: "flex",
          }}
        >
          占処 ── AI占い師
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
