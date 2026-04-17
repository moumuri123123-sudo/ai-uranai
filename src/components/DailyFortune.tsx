"use client";

import { useState, useEffect } from "react";
import { getDailyFortune, type DailyFortuneData } from "@/lib/daily-fortune";
import DailyFortuneShare from "./DailyFortuneShare";

export default function DailyFortune() {
  const [fortune, setFortune] = useState<DailyFortuneData | null>(null);

  useEffect(() => {
    setFortune(getDailyFortune());
  }, []);

  if (!fortune) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-gold/30 bg-surface p-6 sm:p-8 text-center shadow-lg shadow-gold/10">
          <p className="text-xs text-muted mb-1">本日の運勢</p>
          <div className="h-8 w-32 mx-auto mb-6 rounded bg-gold/10 animate-pulse" />
          <div className="h-4 w-48 mx-auto mb-4 rounded bg-gold/10 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-gold/30 bg-surface p-6 sm:p-8 text-center shadow-lg shadow-gold/10">
        {/* 日付 */}
        <p className="text-xs text-muted mb-1">本日の運勢</p>
        <h2 className="font-yuji text-2xl text-gold animate-gold-pulse sm:text-3xl mb-6">
          {fortune.dateLabel}
        </h2>

        {/* 星評価 */}
        <div
          className="flex items-center justify-center gap-1 mb-4"
          role="img"
          aria-label={`運勢${fortune.starRating}段階中${fortune.starRating}`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`text-lg ${
                i < fortune.starRating
                  ? "text-gold"
                  : "text-muted/30"
              }`}
            >
              &#x2726;
            </span>
          ))}
        </div>

        {/* 装飾ライン */}
        <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
          <div className="h-px w-12 bg-gold/30" />
          <span className="font-yuji text-sm text-gold/50">占</span>
          <div className="h-px w-12 bg-gold/30" />
        </div>

        {/* メッセージ */}
        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mb-6 max-w-md mx-auto">
          {fortune.message}
        </p>

        {/* ラッキーアイテム */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-2">
          {/* ラッキーカラー */}
          <div className="rounded-xl border border-border bg-[#0a0408] p-3">
            <p className="text-[10px] text-muted mb-1.5">ラッキーカラー</p>
            <div className="flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: fortune.luckyColor }}
              />
              <span className="text-sm font-medium text-foreground/90">
                {fortune.luckyColorName}
              </span>
            </div>
          </div>

          {/* ラッキーナンバー */}
          <div className="rounded-xl border border-border bg-[#0a0408] p-3">
            <p className="text-[10px] text-muted mb-1.5">ラッキーナンバー</p>
            <span className="text-xl font-bold text-gold">
              {fortune.luckyNumber}
            </span>
          </div>

          {/* ラッキー方角 */}
          <div className="rounded-xl border border-border bg-[#0a0408] p-3">
            <p className="text-[10px] text-muted mb-1.5">ラッキー方角</p>
            <span className="text-sm font-medium text-foreground/90">
              {fortune.luckyDirection}
            </span>
          </div>
        </div>

        {/* シェアボタン */}
        <DailyFortuneShare message={fortune.message} />
      </div>
    </section>
  );
}
