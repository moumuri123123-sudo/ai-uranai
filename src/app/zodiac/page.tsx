"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
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

export default function ZodiacPage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const selected = selectedSign ? zodiacSigns[selectedSign] : null;

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">{"\u2B50"}</div>
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-gold animate-gold-pulse">
              星座占い
            </span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            あなたの星座を選んで、今日の運勢をAI占い師に聞いてみましょう。
          </p>
        </div>

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
                  onClick={() => setSelectedSign(sign.key)}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-all hover:border-gold/50 hover:bg-surface-hover hover:shadow-lg hover:shadow-gold/10 active:scale-95"
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">
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
              <span className="text-4xl">{zodiacEmojis[selectedSign]}</span>
              <p className="mt-2 text-xl font-bold text-gold">{selected.name}</p>
              <p className="mt-1 text-xs text-muted">
                {selected.period} / {selected.element}のエレメント
              </p>
              <button
                onClick={() => setSelectedSign(null)}
                className="mt-3 text-xs text-warm underline underline-offset-2 transition-colors hover:text-gold"
              >
                星座を変更する
              </button>
            </div>

            <ChatBox
              fortuneType="zodiac"
              zodiacSign={selectedSign}
              initialMessage={`${selected.name}（${selected.period}）のあなたですね。${selected.element}のエレメントに属し、${selected.traits}とされています。\n\nどのようなことが気になりますか？ 今日の運勢、恋愛運、仕事運など、何でもお聞きください。`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
