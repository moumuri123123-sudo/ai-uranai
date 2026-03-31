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
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.googletagservices.com https://*.google.com https://*.google.co.jp https://*.googletagmanager.com https://*.googleadservices.com https://*.doubleclick.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googlesyndication.com https://*.google.com https://*.google.co.jp https://*.doubleclick.net https://*.googletagmanager.com https://*.gstatic.com",
              "connect-src 'self' https://generativelanguage.googleapis.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com https://*.google.com",
              "frame-src https://*.doubleclick.net https://*.googlesyndication.com https://*.google.com",
              "frame-ancestors 'none'",
            ].join("; ") + ";",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
