import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "占い履歴",
  description:
    "過去の占い結果を振り返ることができます。タロット・星座・相性・MBTI・夢占い・数秘術の鑑定履歴を一覧で確認。",
  openGraph: {
    title: "占い履歴 | 占処 AI占い",
    description:
      "過去の占い結果を振り返ることができます。タロット・星座・相性・MBTI・夢占い・数秘術の鑑定履歴を一覧で確認。",
    url: "https://uranaidokoro.com/history",
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
