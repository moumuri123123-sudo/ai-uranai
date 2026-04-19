import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI®性格診断",
  description:
    "16タイプの性格診断をAIが分析。MBTI®タイプに基づいた恋愛・仕事・人間関係のアドバイスをお届けします。",
  alternates: {
    canonical: "https://uranaidokoro.com/mbti",
  },
  openGraph: {
    title: "MBTI®性格診断 | 占処 AI占い",
    description:
      "16タイプの性格診断をAIが分析。あなたのMBTI®タイプを発見しましょう。",
    url: "https://uranaidokoro.com/mbti",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI診断 | 占処 AI占い",
    description: "16タイプの性格診断をAIがサポート。自分を深く知るきっかけに。MBTI®は登録商標です。",
  },
};

export default function MbtiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
