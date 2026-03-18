import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://adservice.google.co.jp https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://pagead2.googlesyndication.com https://www.google.com https://www.google.co.jp https://googleads.g.doubleclick.net https://www.googletagmanager.com; connect-src 'self' https://generativelanguage.googleapis.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
