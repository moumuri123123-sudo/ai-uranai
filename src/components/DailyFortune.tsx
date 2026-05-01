'use client';

import { useState, useEffect } from 'react';
import { getDailyFortune, type DailyFortuneData } from '@/lib/daily-fortune';
import DailyFortuneShare from './DailyFortuneShare';

export default function DailyFortune() {
  const [fortune, setFortune] = useState<DailyFortuneData | null>(null);

  useEffect(() => {
    // 日付ベースのfortuneはサーバー/クライアントで微妙に差異が出るため、
    // ハイドレーション後にクライアント側で計算してセットする
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFortune(getDailyFortune());
  }, []);

  if (!fortune) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="border-gold/30 bg-surface shadow-gold/10 rounded-2xl border p-6 text-center shadow-lg sm:p-8">
          <p className="text-muted mb-1 text-xs">本日の運勢</p>
          <div className="bg-gold/10 mx-auto mb-6 h-8 w-32 animate-pulse rounded" />
          <div className="bg-gold/10 mx-auto mb-4 h-4 w-48 animate-pulse rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="border-gold/30 bg-surface shadow-gold/10 rounded-2xl border p-6 text-center shadow-lg sm:p-8">
        {/* 日付 */}
        <p className="text-muted mb-1 text-xs">本日の運勢</p>
        <h2 className="font-yuji text-gold animate-gold-pulse mb-6 text-2xl sm:text-3xl">
          {fortune.dateLabel}
        </h2>

        {/* 星評価 */}
        <div
          className="mb-4 flex items-center justify-center gap-1"
          role="img"
          aria-label={`運勢5段階中${fortune.starRating}`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`text-lg ${i < fortune.starRating ? 'text-gold' : 'text-muted/30'}`}
            >
              &#x2726;
            </span>
          ))}
        </div>

        {/* 装飾ライン */}
        <div className="mb-5 flex items-center justify-center gap-4" aria-hidden="true">
          <div className="bg-gold/30 h-px w-12" />
          <span className="font-yuji text-gold/50 text-sm">占</span>
          <div className="bg-gold/30 h-px w-12" />
        </div>

        {/* メッセージ */}
        <p className="text-foreground/90 mx-auto mb-6 max-w-md text-sm leading-relaxed sm:text-base">
          {fortune.message}
        </p>

        {/* ラッキーアイテム */}
        <div className="mb-2 grid grid-cols-3 gap-3 sm:gap-4">
          {/* ラッキーカラー */}
          <div className="border-border rounded-xl border bg-[#0a0408] p-3">
            <p className="text-muted mb-1.5 text-[10px]">ラッキーカラー</p>
            <div className="flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: fortune.luckyColor }}
              />
              <span className="text-foreground/90 text-sm font-medium">
                {fortune.luckyColorName}
              </span>
            </div>
          </div>

          {/* ラッキーナンバー */}
          <div className="border-border rounded-xl border bg-[#0a0408] p-3">
            <p className="text-muted mb-1.5 text-[10px]">ラッキーナンバー</p>
            <span className="text-gold text-xl font-bold">{fortune.luckyNumber}</span>
          </div>

          {/* ラッキー方角 */}
          <div className="border-border rounded-xl border bg-[#0a0408] p-3">
            <p className="text-muted mb-1.5 text-[10px]">ラッキー方角</p>
            <span className="text-foreground/90 text-sm font-medium">{fortune.luckyDirection}</span>
          </div>
        </div>

        {/* シェアボタン */}
        <DailyFortuneShare message={fortune.message} />
      </div>
    </section>
  );
}
