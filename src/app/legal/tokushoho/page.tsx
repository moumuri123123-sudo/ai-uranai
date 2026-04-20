import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description:
    "占処 AI占いの特定商取引法に基づく表記です。事業者情報・料金・サービス内容等を掲載しています。",
  alternates: {
    canonical: "https://uranaidokoro.com/legal/tokushoho",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Row = {
  label: string;
  value: React.ReactNode;
};

const rows: Row[] = [
  { label: "事業者名", value: "廣末 大輝" },
  {
    label: "所在地",
    value: (
      <>
        請求があれば遅滞なく開示します。
        <span className="mt-1 block text-xs text-muted">
          ※ お問い合わせフォーム、または下記メールアドレス宛にご連絡ください。
        </span>
      </>
    ),
  },
  {
    label: "電話番号",
    value: (
      <>
        請求があれば遅滞なく開示します。
        <span className="mt-1 block text-xs text-muted">
          ※ お問い合わせフォーム、または下記メールアドレス宛にご連絡ください。
        </span>
      </>
    ),
  },
  {
    label: "メールアドレス",
    value: (
      <a
        href="mailto:oyasumi6964@gmail.com"
        className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
      >
        oyasumi6964@gmail.com
      </a>
    ),
  },
  { label: "運営責任者", value: "廣末 大輝" },
  { label: "販売価格", value: "無料（広告収益により運営）" },
  { label: "販売商品", value: "AI占いエンターテインメントサービス" },
  { label: "支払方法", value: "該当なし（無料サービス）" },
  { label: "サービス提供時期", value: "即時" },
  { label: "返金について", value: "無料サービスのため該当なし" },
];

export default function TokushohoPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          特定商取引法に基づく表記
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section className="rounded-xl border border-border bg-surface p-6">
            <p>
              本ページは、特定商取引に関する法律に基づき、占処 AI占い（以下「本サービス」）の
              運営に関する事業者情報を掲載するものです。
              本サービスは広告収益により運営される無料のエンターテインメントサービスであり、
              ユーザーへの直接的な販売・課金は行っておりません。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              事業者情報
            </h2>
            <dl className="divide-y divide-border/70">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4"
                >
                  <dt className="text-xs font-semibold tracking-wide text-muted sm:text-sm">
                    {row.label}
                  </dt>
                  <dd className="text-foreground/90">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              ※ 本サービスは個人運営です。特定商取引法第11条および関係省令に基づき、
              所在地・電話番号等については、消費者の方からの請求があった場合に
              遅滞なく書面または電子メールにより開示いたします。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              関連規程
            </h2>
            <p>
              本サービスのご利用にあたっての条件や個人情報の取扱いについては、下記をご確認ください。
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
                >
                  このサイトについて
                </Link>
              </li>
            </ul>
          </section>

          <div className="border-t border-border pt-6 text-center text-xs text-muted">
            <p>最終更新日: 2026年4月20日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
