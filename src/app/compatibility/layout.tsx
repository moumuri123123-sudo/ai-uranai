import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "相性占い",
  description:
    "気になるあの人との相性をAI占い師が鑑定。恋愛・友情・仕事の相性を総合的に占います。",
  alternates: {
    canonical: "/compatibility",
  },
  openGraph: {
    title: "相性占い | 占処 AI占い",
    description:
      "気になるあの人との相性をAI占い師が鑑定します。",
    url: "https://uranaidokoro.com/compatibility",
  },
};

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
