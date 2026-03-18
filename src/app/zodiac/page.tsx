"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import FortuneIcon from "@/components/FortuneIcon";
import { zodiacSigns } from "@/lib/fortune-data";
import { webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

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
  const [resultSummary, setResultSummary] = useState("");

  const selected = selectedSign ? zodiacSigns[selectedSign] : null;

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          webApplicationJsonLd({ name: "星座占い", description: "12星座から今日の運勢をAIが詳しく鑑定します", path: "/zodiac" }),
          breadcrumbJsonLd([{ name: "星座占い", path: "/zodiac" }]),
        ]) }}
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
              historyLabel={`星座占い - ${selected.name}`}
              initialMessage={`${selected.name}（${selected.period}）のあなたですね。${selected.element}のエレメントに属し、${selected.traits}とされています。\n\nどのようなことが気になりますか？ 今日の運勢、恋愛運、仕事運など、何でもお聞きください。`}
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
        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この占い結果はAIが生成したエンターテインメントであり、科学的根拠はありません。医療・健康・法律・金銭に関する重大な判断は、必ず専門家にご相談ください。結果を過度に信頼したり、依存しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="zodiac-1" />
      </div>
    </div>
  );
}
