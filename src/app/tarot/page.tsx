"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import FortuneIcon from "@/components/FortuneIcon";
import { tarotCards } from "@/lib/fortune-data";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

const CARD_BACK = "占";

type DrawnCard = {
  name: string;
  reversed: boolean;
};

const THEMES = [
  { key: "総合運", icon: "運", description: "全体の運勢", text: "text-neon-red", border: "hover:border-neon-red/50", shadow: "hover:shadow-neon-red/10" },
  { key: "恋愛運", icon: "恋", description: "恋愛・出会い", text: "text-neon-pink", border: "hover:border-neon-pink/50", shadow: "hover:shadow-neon-pink/10" },
  { key: "仕事運", icon: "業", description: "仕事・キャリア", text: "text-neon-cyan", border: "hover:border-neon-cyan/50", shadow: "hover:shadow-neon-cyan/10" },
  { key: "金運", icon: "財", description: "お金・財運", text: "text-gold", border: "hover:border-gold/50", shadow: "hover:shadow-gold/10" },
  { key: "人間関係", icon: "縁", description: "友人・家族", text: "text-neon-purple", border: "hover:border-neon-purple/50", shadow: "hover:shadow-neon-purple/10" },
  { key: "健康運", icon: "体", description: "体調・メンタル", text: "text-neon-amber", border: "hover:border-neon-amber/50", shadow: "hover:shadow-neon-amber/10" },
];

export default function TarotPage() {
  const [phase, setPhase] = useState<"theme" | "select" | "flip" | "chat">("theme");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [resultSummary, setResultSummary] = useState("");

  const handleDrawCard = () => {
    const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const reversed = Math.random() < 0.35;
    setDrawnCard({ name: card.name, reversed });
    setIsFlipped(false);
    setPhase("flip");

    setTimeout(() => {
      setIsFlipped(true);
    }, 300);

    setTimeout(() => {
      setPhase("chat");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          webApplicationJsonLd({ name: "タロット占い", description: "78枚のタロットカードからAIがあなたの運命を読み解きます", path: "/tarot" }),
          breadcrumbJsonLd([{ name: "タロット占い", path: "/tarot" }]),
        ]) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4"><FortuneIcon type="tarot" size="lg" /></div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-red animate-neon-pulse">
              タロット占い
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            タロットカードが、あなたの過去・現在・未来を映し出します。
            心を落ち着けて、カードを引いてみましょう。
          </p>
        </div>

        {/* ===== テーマ選択フェーズ ===== */}
        {phase === "theme" && (
          <div className="mx-auto max-w-lg">
            <h2 className="mb-6 text-center text-sm font-medium text-warm">
              占いたいテーマを選んでください
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => {
                    setSelectedTheme(theme.key);
                    setPhase("select");
                  }}
                  className={`group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-5 transition-all ${theme.border} hover:bg-surface-hover hover:shadow-lg ${theme.shadow} active:scale-95`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#0a0408] font-yuji text-xl ${theme.text}`}>
                    {theme.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground/90">
                    {theme.key}
                  </span>
                  <span className="text-[10px] text-muted">{theme.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== カード選択フェーズ ===== */}
        {phase === "select" && (
          <div className="mx-auto max-w-md">
            {/* 選んだテーマ表示 */}
            <div className="mb-6 text-center">
              <span className="inline-block rounded-full border border-neon-red/30 bg-surface px-4 py-1.5 text-xs text-neon-red">
                テーマ: {selectedTheme}
              </span>
              <button
                onClick={() => { setPhase("theme"); setSelectedTheme(null); }}
                className="ml-3 text-xs text-muted underline underline-offset-2 hover:text-warm transition-colors"
              >
                変更
              </button>
            </div>

            <div className="mb-10 flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 w-20 rounded-lg border border-neon-red/30 bg-surface shadow-lg transition-transform hover:-translate-y-2 hover:border-neon-red/60 hover:shadow-neon-red/20 cursor-pointer sm:h-36 sm:w-24"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={handleDrawCard}
                >
                  <div className="flex h-full w-full items-center justify-center font-yuji text-3xl text-neon-red/60 sm:text-4xl">
                    {CARD_BACK}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleDrawCard}
                className="rounded-full border-2 border-neon-red bg-transparent px-8 py-3 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/10 hover:shadow-lg hover:shadow-neon-red/20 active:scale-95"
              >
                カードを引く
              </button>
              <p className="mt-4 text-xs text-muted">
                カードをクリックするか、ボタンを押してください
              </p>
            </div>
          </div>
        )}

        {/* ===== カードフリップフェーズ ===== */}
        {phase === "flip" && drawnCard && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="card-flip-container">
              <div className={`card-flip-inner ${isFlipped ? "flipped" : ""}`}>
                {/* 表面 = カード裏（占の文字） */}
                <div className="card-flip-front border-2 border-neon-red/50 bg-surface shadow-2xl shadow-neon-red/20">
                  <div className="flex h-full w-full items-center justify-center font-yuji text-4xl text-neon-red/60 sm:text-5xl">
                    {CARD_BACK}
                  </div>
                </div>
                {/* 裏面 = カード表（カード名 + 正逆位置） */}
                <div className="card-flip-back border-2 border-gold/50 bg-surface shadow-2xl shadow-gold/20">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-2">
                    <p className="font-yuji text-lg text-gold sm:text-xl">
                      {drawnCard.name}
                    </p>
                    <p className="text-xs text-neon-red">
                      {drawnCard.reversed ? "逆位置" : "正位置"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* グロー効果 */}
            <div className="mt-2 h-4 w-20 rounded-full bg-gold/10 blur-xl" />
            <p className="mt-6 text-sm text-neon-red animate-pulse">
              {isFlipped ? "カードが示されました..." : "カードをめくっています..."}
            </p>
          </div>
        )}

        {/* ===== チャットフェーズ ===== */}
        {phase === "chat" && drawnCard && (
          <div>
            <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-neon-red/30 bg-surface p-6 text-center shadow-lg shadow-neon-red/10">
              <p className="mb-1 text-xs text-muted">あなたが引いたカード</p>
              <p className="text-2xl font-bold text-gold">
                {drawnCard.name}
              </p>
              <p className="mt-1 text-sm text-neon-red">
                {drawnCard.reversed ? "逆位置" : "正位置"}
              </p>
              {selectedTheme && (
                <p className="mt-2 text-xs text-muted">
                  テーマ: {selectedTheme}
                </p>
              )}
            </div>

            <ChatBox
              fortuneType="tarot"
              tarotTheme={selectedTheme || undefined}
              tarotCard={drawnCard.name}
              tarotReversed={drawnCard.reversed}
              historyLabel={`タロット占い - ${drawnCard.name} ${drawnCard.reversed ? "逆位置" : "正位置"}${selectedTheme ? ` (${selectedTheme})` : ""}`}
              autoStart
              onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            />
            <ShareButtons
              title="タロット占い結果"
              resultData={resultSummary ? {
                fortuneType: "tarot",
                label: `${drawnCard.name} ${drawnCard.reversed ? "逆位置" : "正位置"}`,
                summary: resultSummary,
              } : undefined}
            />

            <button
              onClick={() => {
                setPhase("theme");
                setSelectedTheme(null);
                setDrawnCard(null);
                setIsFlipped(false);
                setResultSummary("");
              }}
              className="mx-auto mt-4 block text-sm text-muted hover:text-warm transition-colors"
            >
              &#x2190; もう一度占う
            </button>
          </div>
        )}
        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この占い結果はAIが生成したエンターテインメントであり、科学的根拠はありません。医療・健康・法律・金銭に関する重大な判断は、必ず専門家にご相談ください。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="tarot-1" />
      </div>
    </div>
  );
}
