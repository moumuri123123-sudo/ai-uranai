import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "占処 ── AI占い師",
  description:
    "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。タロット・星座・相性・MBTI。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <body className="antialiased">
        {/* ヘッダー */}
        <header className="sticky top-0 z-50 border-b border-border bg-[#0a0408]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="font-yuji text-2xl tracking-widest text-neon-red animate-neon-pulse"
            >
              占処
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/tarot"
                className="text-sm text-foreground/70 transition-colors hover:text-gold"
              >
                タロット
              </Link>
              <Link
                href="/zodiac"
                className="text-sm text-foreground/70 transition-colors hover:text-gold"
              >
                星座占い
              </Link>
              <Link
                href="/compatibility"
                className="text-sm text-foreground/70 transition-colors hover:text-gold"
              >
                相性占い
              </Link>
              <Link
                href="/mbti"
                className="text-sm text-foreground/70 transition-colors hover:text-gold"
              >
                MBTI診断
              </Link>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="min-h-screen">{children}</main>

        {/* フッター */}
        <footer className="border-t border-border bg-[#0a0408]">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="font-yuji text-sm text-warm">
                  占処 ── AI占い師
                </p>
                <p className="mt-1 text-xs text-muted">
                  ※ 占い結果はエンターテインメント目的です。重要な判断は専門家にご相談ください。
                </p>
              </div>
              <div className="flex gap-6">
                <Link
                  href="/terms"
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  利用規約
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  プライバシーポリシー
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
