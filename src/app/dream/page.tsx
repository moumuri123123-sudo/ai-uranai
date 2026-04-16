import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import DreamGuide from "@/components/fortune-guides/DreamGuide";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
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

        <ReadingExperience relatedArticles={<RelatedArticles category="dream" />} />

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
