import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // gzip/brotli圧縮（Next.js 16はデフォルトで有効だが明示）
  compress: true,
  experimental: {
    // 大きなパッケージのTree-shakingを改善して初期バンドルを軽く
    optimizePackageImports: ['@google/genai', '@supabase/ssr', '@supabase/supabase-js'],
  },
  async redirects() {
    // 削除した旧ブログ記事のリダイレクト先（関連記事 or カテゴリトップ）
    const blogRedirects: Array<{ from: string; to: string }> = [
      { from: 'zodiac-2026-horoscope', to: '/zodiac' },
      { from: 'feng-shui-beginner', to: '/blog' },
      { from: 'power-stone-guide', to: '/blog' },
      { from: 'love-luck-tips', to: '/blog/compatibility-improve-tips' },
      { from: 'palm-reading-basics', to: '/blog' },
      { from: 'morning-fortune-routine', to: '/blog/seasonal-fortune-spring' },
      { from: 'tarot-spread-guide', to: '/blog/tarot-minor-arcana-guide' },
      { from: 'compatibility-blood-type', to: '/blog/compatibility-improve-tips' },
      { from: 'compatibility-birthday', to: '/blog/compatibility-improve-tips' },
      { from: 'mbti-work-style', to: '/blog/mbti-basic-guide' },
      { from: 'mbti-compatibility', to: '/blog/mbti-compatibility-ranking-all' },
      { from: 'dream-lucid-guide', to: '/blog/dream-interpretation-guide' },
      { from: 'dream-recurring-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'numerology-birthday-number', to: '/blog/numerology-life-path-guide' },
      { from: 'meditation-fortune', to: '/blog' },
      { from: 'aura-color-meaning', to: '/blog' },
      { from: 'tarot-yes-no-reading', to: '/blog/tarot-major-arcana-meanings' },
      { from: 'zodiac-rising-sign', to: '/blog/zodiac-moon-sign' },
      { from: 'dream-color-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'mbti-stress-coping', to: '/blog/mbti-introvert-strength' },
      { from: 'tarot-love-feelings', to: '/blog/tarot-love-reading-beginner' },
      { from: 'zodiac-compatibility-ranking', to: '/blog/zodiac-elements-guide' },
      { from: 'compatibility-love-signs', to: '/blog/compatibility-improve-tips' },
      { from: 'numerology-soul-number', to: '/blog/numerology-name-reading' },
      { from: 'dream-chased-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'dream-crush-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'dream-cat-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'zodiac-2026-april-fortune', to: '/zodiac' },
      { from: 'dream-water-meaning', to: '/blog/dream-interpretation-guide' },
      { from: 'numerology-2026-personal-year', to: '/blog/numerology-life-path-guide' },
      { from: 'compatibility-zodiac-element', to: '/blog/zodiac-elements-guide' },
      { from: 'zodiac-2026-may-fortune', to: '/zodiac' },
      { from: 'compatibility-marriage-tips', to: '/blog/compatibility-improve-tips' },
      { from: 'numerology-master-numbers', to: '/blog/numerology-life-path-guide' },
      { from: 'tarot-reconciliation-reading', to: '/blog/tarot-love-reading-beginner' },
    ];
    return blogRedirects.map(({ from, to }) => ({
      source: `/blog/${from}`,
      destination: to,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://adservice.google.co.jp https://www.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              'frame-src https://pagead2.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google',
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
