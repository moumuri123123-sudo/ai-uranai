import { Suspense } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import DreamGuide from "@/components/fortune-guides/DreamGuide";
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { dreamFaqs } from "@/lib/faqs/dream";
import ReadingExperience from "./ReadingExperience";

export default function DreamPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          webApplicationJsonLd({ name: "夢占い", description: "あなたが見た夢の意味をAIが深層心理から読み解きます", path: "/dream" }),
          breadcrumbJsonLd([{ name: "夢占い", path: "/dream" }]),
        ]) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="dream" size="lg" /></div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-purple" style={{ textShadow: "0 0 12px rgba(136,72,152,0.4)" }}>
              夢占い
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            あなたが見た夢にはメッセージが隠されています。
            夢のキーワードを入力して、AIが深層心理を読み解きます。
          </p>
        </div>

        <Suspense fallback={<div className="py-16 text-center text-muted">読み込み中…</div>}>
          <ReadingExperience relatedArticles={<RelatedArticles category="dream" />} />
        </Suspense>

        {/* 夢占いトレンドへの導線 */}
        <div className="mt-10 rounded-xl border border-neon-purple/30 bg-surface/30 p-5 text-center">
          <p className="mb-2 text-sm text-warm">
            🌙 今月みんなが見ている夢は？
          </p>
          <Link
            href="/dream-trends"
            className="inline-block rounded-full border border-neon-purple px-5 py-2 text-xs font-semibold text-neon-purple transition-colors hover:bg-neon-purple/10"
          >
            夢占いトレンドを見る
          </Link>
        </div>

        <FAQJsonLd id="faq-dream" items={dreamFaqs.items} />
        <FAQSection title={dreamFaqs.title} items={dreamFaqs.items} idPrefix="faq-dream" />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ 夢占いの結果はエンターテインメント目的です。夢の解釈は文化や個人の経験によって異なります。深刻なお悩みがある場合は、専門のカウンセラーにご相談ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="dream-1" />
      </div>
      <DreamGuide />
    </div>
  );
}
