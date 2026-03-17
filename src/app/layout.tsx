import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "占処 ── AI占い師",
    template: "%s | 占処 AI占い",
  },
  description:
    "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。タロット・星座・相性・MBTI。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://ai-uranai-ochre.vercel.app",
    siteName: "占処 AI占い",
    title: "占処 ── AI占い師",
    description:
      "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。",
    images: [
      {
        url: "https://ai-uranai-ochre.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "占処 AI占い",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "占処 ── AI占い師",
    description:
      "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。",
    images: ["https://ai-uranai-ochre.vercel.app/og-image.svg"],
  },
  verification: {
    google: "hfq3il8cfvpzkX_2NtHGNIwa_IZRmjgExGh9C-1Btcw",
  },
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
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
          </Script>
        </>
      )}
      <body className="antialiased">
        <Header />

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
