import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "数秘術",
  description:
    "生年月日からライフパスナンバーを算出し、あなたの運命・才能・人生の使命をAIが鑑定します。",
  alternates: {
    canonical: "https://uranaidokoro.com/numerology",
  },
  openGraph: {
    title: "数秘術 | 占処 AI占い",
    description:
      "生年月日からライフパスナンバーを算出し、あなたの運命・才能・人生の使命をAIが鑑定します。",
    url: "https://uranaidokoro.com/numerology",
  },
  twitter: {
    card: "summary_large_image",
    title: "数秘術 | 占処 AI占い",
    description: "生年月日から運命数を導くAI数秘術。あなたの本質と人生のテーマを読み解きます。",
  },
};

export default function NumerologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
