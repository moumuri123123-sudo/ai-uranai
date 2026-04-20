import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gzip/brotli圧縮（Next.js 16はデフォルトで有効だが明示）
  compress: true,
  experimental: {
    // 大きなパッケージのTree-shakingを改善して初期バンドルを軽く
    optimizePackageImports: [
      "@google/genai",
      "@supabase/ssr",
      "@supabase/supabase-js",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://adservice.google.co.jp https://www.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "frame-src https://pagead2.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
