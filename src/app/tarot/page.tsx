import AdBanner from "@/components/AdBanner";
import RelatedArticles from "@/components/RelatedArticles";
import TarotGuide from "@/components/fortune-guides/TarotGuide";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import ReadingExperience from "./ReadingExperience";

// JSON-LDは静的なデータのみで構成（XSSリスクなし）
const jsonLdData = JSON.stringify([
  webApplicationJsonLd({ name: "タロット占い", description: "78枚のタロットカードからAIがあなたの運命を読み解きます", path: "/tarot" }),
  breadcrumbJsonLd([{ name: "タロット占い", path: "/tarot" }]),
]);

export default function TarotPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ReadingExperience relatedArticles={<RelatedArticles category="tarot" />} />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted">
            ※ この占い結果はAIが生成したエンターテインメントであり、科学的根拠はありません。医療・健康・法律・金銭に関する重大な判断は、必ず専門家にご相談ください。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="tarot-1" />
      </div>
      <TarotGuide />
    </div>
  );
}
