import { ImageResponse } from "next/og";

export const alt = "占処 夢占い";
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
          background: "linear-gradient(135deg, #0a0408 0%, #1a0a14 50%, #2a0a1f 100%)",
          color: "#f5e6d0",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 48, color: "#ffd700", marginBottom: 16 }}>占処</div>
        <div style={{ fontSize: 92, fontWeight: 700, color: "#ff2d55" }}>夢占い</div>
        <div style={{ fontSize: 32, color: "#f5e6d0", marginTop: 24 }}>夢が告げる心の声</div>
      </div>
    ),
    { ...size }
  );
}
