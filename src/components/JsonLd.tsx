import Script from "next/script";

// Next.jsの推奨パターンでJSON-LD構造化データを出力。
// 入力は自サイトで生成した構造化データのみ（ユーザー入力は受け取らない）。
type JsonLdProps = {
  id: string;
  data: unknown;
};

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script id={id} type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
