import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "夢占い",
  description:
    "あなたが見た夢の意味をAIが深層心理から読み解きます。夢のキーワードを入力して、隠されたメッセージを発見しましょう。",
  alternates: {
    canonical: "https://uranaidokoro.com/dream",
  },
  openGraph: {
    title: "夢占い | 占処 AI占い",
    description:
      "あなたが見た夢の意味をAIが深層心理から読み解きます。夢のキーワードを入力して、隠されたメッセージを発見しましょう。",
    url: "https://uranaidokoro.com/dream",
  },
  twitter: {
    card: "summary_large_image",
    title: "夢占い | 占処 AI占い",
    description: "AIが夢の象徴を読み解き、あなたの無意識を紐解きます。短い夢でもOK、無料で診断。",
  },
};

export default function DreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
