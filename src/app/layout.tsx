import type { Metadata, Viewport } from "next";
import { Shippori_Mincho_B1, Zen_Maru_Gothic } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--font-body",
});

// Yuji Syukuは廃止し、Shippori MinchoをYuji用途にも流用（--font-yujiも同じfont-familyを指すようにglobals.cssで定義）
const shipporiMincho = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-mincho",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uranaidokoro.com"),
  title: {
    default: "占処 ── AI占い師",
    template: "%s | 占処 AI占い",
  },
  description:
    "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。タロット・星座・相性・MBTI®・夢占い・数秘術。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://uranaidokoro.com",
    siteName: "占処 AI占い",
    title: "占処 ── AI占い師",
    description:
      "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。",
  },
  twitter: {
    card: "summary_large_image",
    title: "占処 ── AI占い師",
    description:
      "レトロな占い館へようこそ。最先端のAIが、古来の占術であなたの運命を紡ぎます。",
  },
  verification: {
    google: "pvyTPNU65t3trS8CreAG65RLQMR_luDhgPBpWUbYTIk",
  },
  other: {
    "google-adsense-account": "ca-pub-2703362176639569",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "占処",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff2d55",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMaruGothic.variable} ${shipporiMincho.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="占処コラム" href="/feed.xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <JsonLd id="ld-website" data={websiteJsonLd()} />
        <JsonLd id="ld-organization" data={organizationJsonLd()} />
      </head>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
          </Script>
        </>
      )}
      <body className={`antialiased ${zenMaruGothic.className}`}>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <Script id="sw-register" strategy="lazyOnload">
          {`if('serviceWorker' in navigator){window.addEventListener('load',()=>{if('requestIdleCallback' in window){requestIdleCallback(()=>navigator.serviceWorker.register('/sw.js'))}else{setTimeout(()=>navigator.serviceWorker.register('/sw.js'),2000)}})}`}
        </Script>
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
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/about"
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  このサイトについて
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  お問い合わせ
                </Link>
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
