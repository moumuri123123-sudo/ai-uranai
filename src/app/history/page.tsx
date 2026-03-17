"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getHistory,
  deleteHistory,
  clearAllHistory,
  type HistoryEntry,
} from "@/lib/history";
import FortuneIcon from "@/components/FortuneIcon";

const fortuneTypeMeta: Record<
  string,
  { type: "tarot" | "zodiac" | "compatibility" | "mbti"; path: string }
> = {
  tarot: { type: "tarot", path: "/tarot" },
  zodiac: { type: "zodiac", path: "/zodiac" },
  compatibility: { type: "compatibility", path: "/compatibility" },
  mbti: { type: "mbti", path: "/mbti" },
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistory(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (window.confirm("すべての占い履歴を削除しますか？")) {
      clearAllHistory();
      setHistory([]);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-gold animate-gold-pulse">占い履歴</span>
          </h1>
          <p className="text-sm text-muted">
            過去の占い結果を振り返ることができます
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <p className="text-muted">まだ占い履歴がありません</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-gold hover:underline"
            >
              占いを始める &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleClearAll}
                className="text-xs text-muted transition-colors hover:text-neon-red"
              >
                すべて削除
              </button>
            </div>

            <div className="space-y-4">
              {history.map((entry) => {
                const meta = fortuneTypeMeta[entry.fortuneType];
                return (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-gold/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {meta && <FortuneIcon type={meta.type} size="sm" />}
                          <h2 className="text-sm font-bold text-foreground">
                            {entry.label}
                          </h2>
                        </div>
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted">
                          {entry.firstResponse}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-xs text-muted">
                            {new Date(entry.timestamp).toLocaleDateString(
                              "ja-JP"
                            )}
                          </span>
                          <Link
                            href={meta?.path || "/"}
                            className="text-xs text-gold hover:underline"
                          >
                            もう一度占う
                          </Link>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="flex-shrink-0 text-xs text-muted transition-colors hover:text-neon-red"
                        aria-label="削除"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
