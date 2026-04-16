import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タロット占い",
  description:
    "AIタロット占い師があなたのためにカードを引き、過去・現在・未来を読み解きます。恋愛、仕事、人間関係の悩みに。",
  alternates: {
    canonical: "/tarot",
  },
  openGraph: {
    title: "タロット占い | 占処 AI占い",
    description:
      "AIタロット占い師があなたのためにカードを引き、過去・現在・未来を読み解きます。",
    url: "https://uranaidokoro.com/tarot",
  },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
