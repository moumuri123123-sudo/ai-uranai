import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import CompatibilityGuide from "@/components/fortune-guides/CompatibilityGuide";
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { compatibilityFaqs } from "@/lib/faqs/compatibility";
import ReadingExperience from "./ReadingExperience";

const jsonLdData = JSON.stringify([
  webApplicationJsonLd({ name: "相性占い", description: "気になるあの人との相性をAIが占います", path: "/compatibility" }),
  breadcrumbJsonLd([{ name: "相性占い", path: "/compatibility" }]),
]);

export default function CompatibilityPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="compatibility" size="lg" /></div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-pink" style={{ textShadow: "0 0 12px rgba(255,105,180,0.4)" }}>
              相性占い
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            二人の名前を入力して、AI占い師に相性を占ってもらいましょう。
            恋愛、友情、仕事のパートナーシップ ― どんな関係でもOKです。
          </p>
        </div>

        <ReadingExperience relatedArticles={<RelatedArticles category="compatibility" />} />

        <FAQJsonLd id="faq-compatibility" items={compatibilityFaqs.items} />
        <FAQSection title={compatibilityFaqs.title} items={compatibilityFaqs.items} idPrefix="faq-compatibility" />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この占い結果はAIが生成したエンターテインメントであり、科学的根拠はありません。医療・健康・法律・金銭に関する重大な判断は、必ず専門家にご相談ください。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="compatibility-1" />
      </div>
      <CompatibilityGuide />
    </div>
  );
}
