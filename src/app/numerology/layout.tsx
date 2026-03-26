import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "数秘術",
  description:
    "生年月日からライフパスナンバーを算出し、あなたの運命・才能・人生の使命をAIが鑑定します。",
  openGraph: {
    title: "数秘術 | 占処 AI占い",
    description:
      "生年月日からライフパスナンバーを算出し、あなたの運命・才能・人生の使命をAIが鑑定します。",
    url: "https://uranaidokoro.com/numerology",
  },
};

export default function NumerologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
