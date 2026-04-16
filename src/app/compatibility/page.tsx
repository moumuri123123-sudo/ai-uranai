"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import FortuneIcon from "@/components/FortuneIcon";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import RelatedArticles from "@/components/RelatedArticles";
import CompatibilityGuide from "@/components/fortune-guides/CompatibilityGuide";

export default function CompatibilityPage() {
  const [phase, setPhase] = useState<"input" | "chat">("input");
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [submittedNames, setSubmittedNames] = useState({ p1: "", p2: "" });
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [resultSummary, setResultSummary] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = person1.trim() || "あなた";
    const p2 = person2.trim() || "お相手";
    // 相性度はここで1回だけ生成し、以降のチャットAPI呼び出しに同じ値を渡して一貫性を保つ
    setCompatibilityScore(Math.floor(Math.random() * 41) + 60);
    setSubmittedNames({ p1, p2 });
    setPhase("chat");
  };

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          webApplicationJsonLd({ name: "相性占い", description: "気になるあの人との相性をAIが占います", path: "/compatibility" }),
          breadcrumbJsonLd([{ name: "相性占い", path: "/compatibility" }]),
        ]) }}
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

        {/* 名前入力フェーズ */}
        {phase === "input" && (
          <div className="mx-auto max-w-md">
            <form onSubmit={handleStart}>
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">
                {/* 1人目 */}
                <div className="mb-5">
                  <label
                    htmlFor="person1"
                    className="mb-2 block text-sm font-medium text-warm"
                  >
                    1人目の名前
                  </label>
                  <input
                    id="person1"
                    type="text"
                    value={person1}
                    onChange={(e) => setPerson1(e.target.value)}
                    placeholder="あなたの名前（ニックネーム可）"
                    className="w-full rounded-xl border border-border bg-[#0a0408] px-4 py-2.5 text-sm text-foreground placeholder-muted/60 focus:border-neon-pink/50 focus:outline-none focus:ring-1 focus:ring-neon-pink/30 transition-colors"
                  />
                </div>

                {/* ハートの装飾 */}
                <div className="my-4 flex items-center justify-center">
                  <div className="h-px flex-1 bg-border" />
                  <span className="mx-4 text-2xl font-yuji text-neon-pink animate-pulse">
                    縁
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* 2人目 */}
                <div className="mb-6">
                  <label
                    htmlFor="person2"
                    className="mb-2 block text-sm font-medium text-warm"
                  >
                    2人目の名前
                  </label>
                  <input
                    id="person2"
                    type="text"
                    value={person2}
                    onChange={(e) => setPerson2(e.target.value)}
                    placeholder="相手の名前（ニックネーム可）"
                    className="w-full rounded-xl border border-border bg-[#0a0408] px-4 py-2.5 text-sm text-foreground placeholder-muted/60 focus:border-neon-pink/50 focus:outline-none focus:ring-1 focus:ring-neon-pink/30 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full border-2 border-neon-pink bg-transparent px-6 py-3 text-sm font-semibold text-neon-pink transition-all hover:bg-neon-pink/10 hover:shadow-lg hover:shadow-neon-pink/20 active:scale-95"
                >
                  相性を占う
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-muted">
                名前を入力しなくても占えます
              </p>
            </form>
          </div>
        )}

        {/* チャットフェーズ */}
        {phase === "chat" && (
          <div>
            <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-neon-pink/30 bg-surface p-6 text-center shadow-lg shadow-neon-pink/10">
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-xs text-muted">1人目</p>
                  <p className="text-lg font-bold text-gold">
                    {submittedNames.p1}
                  </p>
                </div>
                <span className="text-2xl font-yuji text-neon-pink">縁</span>
                <div>
                  <p className="text-xs text-muted">2人目</p>
                  <p className="text-lg font-bold text-gold">
                    {submittedNames.p2}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPhase("input")}
                className="mt-3 text-xs text-warm underline underline-offset-2 transition-colors hover:text-gold"
              >
                名前を変更する
              </button>
            </div>

            <ChatBox
              fortuneType="compatibility"
              person1={submittedNames.p1}
              person2={submittedNames.p2}
              compatibilityScore={compatibilityScore ?? undefined}
              historyLabel={`相性占い - ${submittedNames.p1} & ${submittedNames.p2}`}
              initialMessage={`${submittedNames.p1}さんと${submittedNames.p2}さんの相性占いですね。\n\nそれでは鑑定に入りますね...`}
              autoStart
              onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            />
            <ShareButtons
              title="相性占い結果"
              resultData={resultSummary ? {
                fortuneType: "compatibility",
                label: `${submittedNames.p1} & ${submittedNames.p2}`,
                summary: resultSummary,
              } : undefined}
            />
          </div>
        )}
        {/* 関連コラム（入力フェーズのみ） */}
        {phase === "input" && <RelatedArticles category="compatibility" />}

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
