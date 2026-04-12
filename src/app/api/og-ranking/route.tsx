import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const VALID_GRADES = new Set(["◎", "○", "△"]);
  const safeGrade = (v: string | null) =>
    v && VALID_GRADES.has(v) ? v : "○";

  const name = (searchParams.get("name") || "星座").slice(0, 10);
  const emoji = (searchParams.get("emoji") || "★").slice(0, 4);
  const rankNum = parseInt(searchParams.get("rank") || "1", 10);
  const rank = Number.isFinite(rankNum) && rankNum >= 1 && rankNum <= 12 ? rankNum : 1;
  const diffNum = parseInt(searchParams.get("diff") || "0", 10);
  const diff = Number.isFinite(diffNum) ? Math.max(-11, Math.min(11, diffNum)) : 0;
  const work = safeGrade(searchParams.get("work"));
  const love = safeGrade(searchParams.get("love"));
  const money = safeGrade(searchParams.get("money"));

  const diffLabel =
    diff > 0 ? `↑${diff}` : diff < 0 ? `↓${Math.abs(diff)}` : "→";
  const diffColor =
    diff > 0 ? "#ffd700" : diff < 0 ? "#8a7a6a" : "#c8a882";
  const rankColor = rank <= 3 ? "#ffd700" : "#f5e6d0";

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
            border: "2px solid #ff2d55",
            borderRadius: 8,
            display: "flex",
            boxShadow:
              "0 0 30px rgba(255,45,85,0.3), inset 0 0 30px rgba(255,45,85,0.1)",
          }}
        />

        {/* ヘッダー */}
        <div
          style={{
            position: "absolute",
            top: 70,
            fontSize: 28,
            color: "#c8a882",
            letterSpacing: "0.15em",
            display: "flex",
          }}
        >
          今日の運勢ランキング
        </div>

        {/* 星座記号 */}
        <div
          style={{
            fontSize: 100,
            color: "#ffd700",
            display: "flex",
            marginBottom: 10,
          }}
        >
          {emoji}
        </div>

        {/* 星座名 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f5e6d0",
            display: "flex",
            letterSpacing: "0.1em",
          }}
        >
          {name}
        </div>

        {/* 順位 + 変動 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: rankColor,
              textShadow: "0 0 40px rgba(255,215,0,0.5)",
              display: "flex",
            }}
          >
            {rank}位
          </div>
          <div
            style={{
              fontSize: 48,
              color: diffColor,
              display: "flex",
            }}
          >
            {diffLabel}
          </div>
        </div>

        {/* 運勢3種 */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 24, color: "#c8a882", display: "flex" }}>
              仕事運
            </div>
            <div style={{ fontSize: 48, color: "#ffd700", display: "flex" }}>
              {work}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 24, color: "#c8a882", display: "flex" }}>
              恋愛運
            </div>
            <div style={{ fontSize: 48, color: "#ff69b4", display: "flex" }}>
              {love}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 24, color: "#c8a882", display: "flex" }}>
              金運
            </div>
            <div style={{ fontSize: 48, color: "#f0a030", display: "flex" }}>
              {money}
            </div>
          </div>
        </div>

        {/* 占処ロゴ */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 22,
            color: "#f5e6d0",
            opacity: 0.5,
            letterSpacing: "0.2em",
            display: "flex",
          }}
        >
          占処 uranaidokoro.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
