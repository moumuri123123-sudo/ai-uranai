"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import { tarotCards } from "@/lib/fortune-data";

const CARD_BACK = "\u{1F0CF}";

type DrawnCard = {
  name: string;
  reversed: boolean;
};

export default function TarotPage() {
  const [phase, setPhase] = useState<"select" | "drawing" | "chat">("select");
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);

  const handleDrawCard = () => {
    setPhase("drawing");

    setTimeout(() => {
      const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      const reversed = Math.random() < 0.35;
      setDrawnCard({ name: card.name, reversed });
      setPhase("chat");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">{CARD_BACK}</div>
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

        {/* カードを引くフェーズ */}
        {phase === "select" && (
          <div className="mx-auto max-w-md">
            <div className="mb-10 flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 w-20 rounded-lg border border-neon-red/30 bg-surface shadow-lg transition-transform hover:-translate-y-2 hover:border-neon-red/60 hover:shadow-neon-red/20 cursor-pointer sm:h-36 sm:w-24"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={handleDrawCard}
                >
                  <div className="flex h-full w-full items-center justify-center text-3xl opacity-60 sm:text-4xl">
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

        {/* カードを引いている最中 */}
        {phase === "drawing" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div
                className="h-40 w-28 rounded-lg border-2 border-neon-red/50 bg-surface shadow-2xl shadow-neon-red/20 sm:h-48 sm:w-32 animate-fade-slide-up"
              >
                <div className="flex h-full w-full items-center justify-center text-4xl sm:text-5xl">
                  {CARD_BACK}
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg bg-neon-red/10 blur-xl animate-pulse" />
            </div>
            <p className="mt-8 text-sm text-neon-red animate-pulse">
              カードを選んでいます...
            </p>
          </div>
        )}

        {/* チャットフェーズ */}
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
            </div>

            <ChatBox
              fortuneType="tarot"
              initialMessage={`あなたが引いたカードは『${drawnCard.name}』の${drawnCard.reversed ? "逆位置" : "正位置"}です。\n\nどのようなことについて占いましょうか？ 恋愛、仕事、人間関係など、気になることを自由にお聞きください。`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
