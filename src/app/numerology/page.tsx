import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import NumerologyGuide from "@/components/fortune-guides/NumerologyGuide";
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { numerologyFaqs } from "@/lib/faqs/numerology";
import ReadingExperience from "./ReadingExperience";

export default function NumerologyPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          webApplicationJsonLd({ name: "数秘術", description: "生年月日からライフパスナンバーを算出しAIが運命を鑑定します", path: "/numerology" }),
          breadcrumbJsonLd([{ name: "数秘術", path: "/numerology" }]),
        ]) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="numerology" size="lg" /></div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-amber" style={{ textShadow: "0 0 12px rgba(240,160,48,0.4)" }}>
              数秘術
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            生年月日からライフパスナンバーを算出し、
            あなたの性格・使命・運命をAIが鑑定します。
          </p>
        </div>

        <ReadingExperience relatedArticles={<RelatedArticles category="numerology" />} />

        <FAQJsonLd id="faq-numerology" items={numerologyFaqs.items} />
        <FAQSection title={numerologyFaqs.title} items={numerologyFaqs.items} idPrefix="faq-numerology" />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ 数秘術の結果はエンターテインメント目的です。ライフパスナンバーの解釈は流派によって異なる場合があります。結果を過度に信頼せず、参考としてお楽しみください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="numerology-1" />
      </div>
      <NumerologyGuide />
    </div>
  );
}
