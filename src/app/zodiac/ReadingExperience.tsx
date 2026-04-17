"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import ShareButtons from "@/components/ShareButtons";
import { zodiacSigns } from "@/lib/fortune-data";

const zodiacList = Object.entries(zodiacSigns).map(([key, sign]) => ({
  key,
  ...sign,
}));

const zodiacEmojis: Record<string, string> = {
  aries: "\u2648",
  taurus: "\u2649",
  gemini: "\u264A",
  cancer: "\u264B",
  leo: "\u264C",
  virgo: "\u264D",
  libra: "\u264E",
  scorpio: "\u264F",
  sagittarius: "\u2650",
  capricorn: "\u2651",
  aquarius: "\u2652",
  pisces: "\u2653",
};

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState("");

  const selected = selectedSign ? zodiacSigns[selectedSign] : null;

  return (
    <>
      {/* 星座が未選択 */}
      {!selectedSign && (
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-sm font-medium text-warm">
            あなたの星座を選んでください
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {zodiacList.map((sign) => (
              <button
                key={sign.key}
                type="button"
                onClick={() => setSelectedSign(sign.key)}
                aria-label={`${sign.name}（${sign.period}）を選ぶ`}
                className="group flex min-h-11 flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-all hover:border-gold/50 hover:bg-surface-hover hover:shadow-lg hover:shadow-gold/10 active:scale-95"
              >
                <span aria-hidden="true" className="text-3xl transition-transform group-hover:scale-110">
                  {zodiacEmojis[sign.key]}
                </span>
                <span className="text-sm font-medium text-foreground/90">
                  {sign.name}
                </span>
                <span className="text-[10px] text-muted">{sign.period}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 星座選択後 → チャット */}
      {selectedSign && selected && (
        <div>
          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-gold/30 bg-surface p-6 text-center shadow-lg shadow-gold/10">
            <span className="text-4xl" aria-hidden="true">{zodiacEmojis[selectedSign]}</span>
            <p className="mt-2 text-xl font-bold text-gold">{selected.name}</p>
            <p className="mt-1 text-xs text-muted">
              {selected.period} / {selected.element}のエレメント
            </p>
            <button
              type="button"
              onClick={() => setSelectedSign(null)}
              className="mt-3 text-xs text-warm underline underline-offset-2 transition-colors hover:text-gold"
            >
              星座を変更する
            </button>
          </div>

          <ChatBox
            fortuneType="zodiac"
            zodiacSign={selectedSign}
            historyLabel={`星座占い - ${selected.name}`}
            initialMessage={`${selected.name}（${selected.period}）のあなたですね。${selected.element}のエレメントに属し、${selected.traits}とされています。\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
          />
          <ShareButtons
            title="星座占い結果"
            resultData={resultSummary ? {
              fortuneType: "zodiac",
              label: selected.name,
              summary: resultSummary,
            } : undefined}
          />
        </div>
      )}
      {/* 関連コラム（星座未選択時のみ） */}
      {!selectedSign && relatedArticles}
    </>
  );
}
