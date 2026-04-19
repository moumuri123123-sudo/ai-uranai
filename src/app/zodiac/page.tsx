import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import ZodiacGuide from "@/components/fortune-guides/ZodiacGuide";
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { zodiacFaqs } from "@/lib/faqs/zodiac";
import ReadingExperience from "./ReadingExperience";

const jsonLdData = JSON.stringify([
  webApplicationJsonLd({ name: "星座占い", description: "12星座から今日の運勢をAIが詳しく鑑定します", path: "/zodiac" }),
  breadcrumbJsonLd([{ name: "星座占い", path: "/zodiac" }]),
]);

export default function ZodiacPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="zodiac" size="lg" /></div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-gold animate-gold-pulse">
              星座占い
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            あなたの星座を選んで、今日の運勢をAI占い師に聞いてみましょう。
          </p>
        </div>

        <ReadingExperience relatedArticles={<RelatedArticles category="zodiac" />} />

        <FAQJsonLd id="faq-zodiac" items={zodiacFaqs.items} />
        <FAQSection title={zodiacFaqs.title} items={zodiacFaqs.items} idPrefix="faq-zodiac" />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この占い結果はAIが生成したエンターテインメントであり、科学的根拠はありません。医療・健康・法律・金銭に関する重大な判断は、必ず専門家にご相談ください。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="zodiac-1" />
      </div>
      <ZodiacGuide />
    </div>
  );
}
