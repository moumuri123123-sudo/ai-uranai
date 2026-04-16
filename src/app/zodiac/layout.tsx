import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "星座占い",
  description:
    "12星座から今日の運勢をAI占い師が詳しく鑑定。総合運、恋愛運、仕事運、金運をお伝えします。",
  alternates: {
    canonical: "/zodiac",
  },
  openGraph: {
    title: "星座占い | 占処 AI占い",
    description:
      "12星座から今日の運勢をAI占い師が詳しく鑑定します。",
    url: "https://uranaidokoro.com/zodiac",
  },
};

export default function ZodiacLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
