"use client";

import { useState } from "react";
import type { ZodiacRanking, ZodiacDetail } from "@/lib/daily-ranking";
import { zodiacSigns } from "@/lib/fortune-data";

const RANK_STYLES = [
  "border-gold bg-gold/10 text-gold",
  "border-warm/60 bg-warm/10 text-warm",
  "border-neon-amber/50 bg-neon-amber/10 text-neon-amber",
];

const RANK_LABELS = ["🥇", "🥈", "🥉"];

interface RankingItem extends ZodiacRanking {
  oneLiner: string;
  detail: ZodiacDetail;
  diff: number;
}

interface Props {
  items: RankingItem[];
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) {
    return <span className="text-sm text-muted">→</span>;
  }
  if (diff > 0) {
    return <span className="text-sm font-bold text-gold">↑{diff}</span>;
  }
  return (
    <span className="text-sm font-bold text-muted">↓{Math.abs(diff)}</span>
  );
}

function GradeDisplay({ grade }: { grade: "◎" | "○" | "△" }) {
  const color =
    grade === "◎"
      ? "text-gold"
      : grade === "○"
      ? "text-foreground"
      : "text-muted";
  return <span className={`text-2xl font-bold ${color}`}>{grade}</span>;
}

export default function RankingList({ items }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const handleShare = (item: RankingItem) => {
    const ogUrl = `https://uranaidokoro.com/api/og-ranking?name=${encodeURIComponent(item.name)}&emoji=${encodeURIComponent(item.emoji)}&rank=${item.rank}&diff=${item.diff}&work=${encodeURIComponent(item.detail.work)}&love=${encodeURIComponent(item.detail.love)}&money=${encodeURIComponent(item.detail.money)}`;
    const text = `${item.name} 今日${item.rank}位！\n仕事${item.detail.work} 恋愛${item.detail.love} 金運${item.detail.money}\n\n#今日の運勢 #星座占い`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://uranaidokoro.com/daily-ranking")}`;
    // OGP画像が反映されるよう一度プリフェッチ
    fetch(ogUrl).catch(() => {});
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-3">
      {items.map((zodiac, i) => {
        const signData = zodiacSigns[zodiac.key as keyof typeof zodiacSigns];
        const isTop3 = i < 3;
        const borderStyle = isTop3
          ? RANK_STYLES[i]
          : "border-border bg-surface text-foreground";
        const isOpen = openKey === zodiac.key;

        return (
          <div
            key={zodiac.key}
            className={`rounded-xl border transition-colors ${borderStyle}`}
          >
            {/* ヘッダー（タップで展開） */}
            <button
              type="button"
              onClick={() =>
                setOpenKey(isOpen ? null : zodiac.key)
              }
              className="flex w-full items-center gap-3 p-3 text-left hover:bg-surface-hover sm:gap-4 sm:p-4"
              aria-expanded={isOpen}
              aria-controls={`detail-${zodiac.key}`}
            >
              {/* 順位 */}
              <div className="flex w-12 shrink-0 flex-col items-center justify-center text-center">
                {isTop3 ? (
                  <span className="text-2xl">{RANK_LABELS[i]}</span>
                ) : (
                  <span className="text-lg font-bold text-muted">
                    {i + 1}位
                  </span>
                )}
                <DiffBadge diff={zodiac.diff} />
              </div>

              {/* 星座記号 */}
              <span className="text-2xl">{zodiac.emoji}</span>

              {/* 星座名と期間 */}
              <div className="min-w-0 flex-1">
                <p className="whitespace-nowrap text-lg font-bold">
                  {zodiac.name}
                </p>
                {signData && (
                  <p className="truncate text-xs text-muted">
                    {signData.period} / {signData.element}の星座
                  </p>
                )}
              </div>

              {/* 一言コメント */}
              <p className="hidden shrink-0 text-sm text-muted sm:block">
                {zodiac.oneLiner}
              </p>

              {/* 展開アイコン */}
              <span className="shrink-0 text-muted">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* モバイル時の一言コメント */}
            <p className="px-4 pb-2 text-sm text-muted sm:hidden">
              {zodiac.oneLiner}
            </p>

            {/* 展開部 */}
            {isOpen && (
              <div
                id={`detail-${zodiac.key}`}
                role="region"
                className="animate-[fadeSlideUp_0.3s_ease-out] border-t border-border/50 px-4 py-4 text-foreground"
              >
                {/* 運勢3種 */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border/40 bg-background/30 py-2">
                    <p className="mb-1 text-xs text-muted">💼 仕事運</p>
                    <GradeDisplay grade={zodiac.detail.work} />
                  </div>
                  <div className="rounded-lg border border-border/40 bg-background/30 py-2">
                    <p className="mb-1 text-xs text-muted">💕 恋愛運</p>
                    <GradeDisplay grade={zodiac.detail.love} />
                  </div>
                  <div className="rounded-lg border border-border/40 bg-background/30 py-2">
                    <p className="mb-1 text-xs text-muted">💰 金運</p>
                    <GradeDisplay grade={zodiac.detail.money} />
                  </div>
                </div>

                {/* 解説文 */}
                <p className="mb-4 text-sm leading-relaxed">
                  {zodiac.detail.detail}
                </p>

                {/* ラッキー要素 */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-muted">ラッキーカラー</p>
                    <p className="mt-1 font-bold text-gold">
                      {zodiac.detail.lucky_color}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">ラッキーアイテム</p>
                    <p className="mt-1 font-bold text-gold">
                      {zodiac.detail.lucky_item}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">ラッキータイム</p>
                    <p className="mt-1 font-bold text-gold">
                      {zodiac.detail.lucky_time}
                    </p>
                  </div>
                </div>

                {/* シェアボタン */}
                <button
                  type="button"
                  onClick={() => handleShare(zodiac)}
                  className="w-full rounded-full border border-neon-red/40 bg-neon-red/5 py-2 text-sm text-neon-red transition-colors hover:bg-neon-red/15"
                >
                  Xでシェアする
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
