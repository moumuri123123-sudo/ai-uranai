import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "夢占い",
  description:
    "あなたが見た夢の意味をAIが深層心理から読み解きます。夢のキーワードを入力して、隠されたメッセージを発見しましょう。",
  openGraph: {
    title: "夢占い | 占処 AI占い",
    description:
      "あなたが見た夢の意味をAIが深層心理から読み解きます。夢のキーワードを入力して、隠されたメッセージを発見しましょう。",
    url: "https://uranaidokoro.com/dream",
  },
};

export default function DreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
