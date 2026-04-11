import { getDailyRanking } from "@/lib/daily-ranking";
import { zodiacSigns } from "@/lib/fortune-data";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "今日の運勢ランキング | 占処",
  description:
    "12星座の今日の運勢ランキングを毎朝更新。あなたの星座は何位？",
  openGraph: {
    title: "今日の運勢ランキング | 占処",
    description:
      "12星座の今日の運勢ランキングを毎朝更新。あなたの星座は何位？",
    url: "https://uranaidokoro.com/daily-ranking",
  },
};

// 毎日更新（ISR: 1時間ごとに再生成）
export const revalidate = 3600;

const RANK_STYLES = [
  // 1位
  "border-gold bg-gold/10 text-gold",
  // 2位
  "border-warm/60 bg-warm/10 text-warm",
  // 3位
  "border-neon-amber/50 bg-neon-amber/10 text-neon-amber",
];

const RANK_LABELS = ["🥇", "🥈", "🥉"];

export default function DailyRankingPage() {
  const { rankings, month, day } = getDailyRanking();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      {/* ヘッダー */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm tracking-widest text-muted">
          ━━━ 毎朝7時更新 ━━━
        </p>
        <h1 className="font-mincho mb-2 text-3xl font-bold tracking-wider text-neon-red sm:text-4xl">
          今日の運勢ランキング
        </h1>
        <p className="font-yuji text-xl text-gold">
          {month}月{day}日
        </p>
      </div>

      {/* ランキングリスト */}
      <div className="space-y-3">
        {rankings.map((zodiac, i) => {
          const signData =
            zodiacSigns[zodiac.key as keyof typeof zodiacSigns];
          const isTop3 = i < 3;
          const borderStyle = isTop3
            ? RANK_STYLES[i]
            : "border-border bg-surface text-foreground";

          return (
            <div
              key={zodiac.key}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-surface-hover ${borderStyle}`}
            >
              {/* 順位 */}
              <div className="flex w-12 shrink-0 items-center justify-center text-center">
                {isTop3 ? (
                  <span className="text-2xl">{RANK_LABELS[i]}</span>
                ) : (
                  <span className="text-lg font-bold text-muted">
                    {i + 1}位
                  </span>
                )}
              </div>

              {/* 星座記号 */}
              <span className="text-2xl">{zodiac.emoji}</span>

              {/* 星座名と特徴 */}
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold">{zodiac.name}</p>
                {signData && (
                  <p className="truncate text-xs text-muted">
                    {signData.period} / {signData.element}の星座
                  </p>
                )}
              </div>

              {/* 占うリンク */}
              <Link
                href="/zodiac"
                className="shrink-0 rounded-full border border-neon-red/30 px-3 py-1 text-xs text-neon-red transition-colors hover:bg-neon-red/10"
              >
                占う
              </Link>
            </div>
          );
        })}
      </div>

      {/* 広告 */}
      <div className="mt-8">
        <AdBanner slot="ranking-bottom" />
      </div>

      {/* 補足 */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="mb-4 text-sm text-muted">
          もっと詳しく占いたい方はこちら
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/zodiac"
            className="rounded-full border border-gold/30 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            星座占い
          </Link>
          <Link
            href="/tarot"
            className="rounded-full border border-neon-red/30 px-4 py-2 text-sm text-neon-red transition-colors hover:bg-neon-red/10"
          >
            タロット占い
          </Link>
          <Link
            href="/numerology"
            className="rounded-full border border-neon-purple/30 px-4 py-2 text-sm text-neon-purple transition-colors hover:bg-neon-purple/10"
          >
            数秘術
          </Link>
        </div>
      </div>

      {/* 注意書き */}
      <p className="mt-6 text-center text-xs text-muted">
        ※ランキングはAIによるエンタメ占いです。毎朝7時に更新されます。
      </p>
    </div>
  );
}
