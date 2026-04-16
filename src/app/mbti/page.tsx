import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import MbtiGuide from "@/components/fortune-guides/MbtiGuide";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import ReadingExperience from "./ReadingExperience";

const jsonLdData = JSON.stringify([
  webApplicationJsonLd({ name: "MBTI性格診断", description: "16タイプの性格診断であなたをAIが分析しアドバイスします", path: "/mbti" }),
  breadcrumbJsonLd([{ name: "MBTI診断", path: "/mbti" }]),
]);

export default function MbtiPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* タイトル */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="mbti" size="lg" /></div>
          <h1 className="font-mincho mb-2 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-cyan" style={{ textShadow: "0 0 12px rgba(0,221,255,0.4)" }}>
              MBTI性格診断
            </span>
          </h1>
          <p className="text-sm text-muted">
            あなたの性格タイプをAIが分析してアドバイスします
          </p>
        </div>

        <ReadingExperience relatedArticles={<RelatedArticles category="mbti" />} />

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この診断は簡易的なものであり、公式のMBTI&reg;診断ではありません。MBTI&reg;（Myers-Briggs Type Indicator）はThe Myers-Briggs Companyの登録商標です。正式な診断は認定プラクティショナーのもとで受けることをおすすめします。本診断はAIが生成したエンターテインメントであり、科学的根拠はありません。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="mbti-1" />
      </div>
      <MbtiGuide />
    </div>
  );
}
