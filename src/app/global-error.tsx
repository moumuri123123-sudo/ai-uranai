"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#0a0408",
          color: "#f5e6d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "32rem" }}>
          <h1
            style={{
              color: "#ff2d55",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "1rem",
              textShadow: "0 0 12px rgba(255,45,85,0.4)",
            }}
          >
            サイト全体でエラーが発生しました
          </h1>
          <p style={{ color: "#c8a882", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            申し訳ありません。予期しないエラーが発生しました。
          </p>
          {error?.digest && (
            <p style={{ color: "#8a7a6a", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
              エラーID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ff2d55",
              backgroundColor: "transparent",
              border: "2px solid #ff2d55",
              borderRadius: "9999px",
              cursor: "pointer",
            }}
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
