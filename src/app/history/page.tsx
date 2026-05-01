'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHistory, deleteHistory, clearAllHistory, type HistoryEntry } from '@/lib/history';
import FortuneIcon from '@/components/FortuneIcon';

const fortuneTypeMeta: Record<
  string,
  { type: 'tarot' | 'zodiac' | 'compatibility' | 'mbti' | 'dream' | 'numerology'; path: string }
> = {
  tarot: { type: 'tarot', path: '/tarot' },
  zodiac: { type: 'zodiac', path: '/zodiac' },
  compatibility: { type: 'compatibility', path: '/compatibility' },
  mbti: { type: 'mbti', path: '/mbti' },
  dream: { type: 'dream', path: '/dream' },
  numerology: { type: 'numerology', path: '/numerology' },
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // localStorageからの履歴復元はクライアント専用処理。
    // サーバーでは空配列で描画し、マウント後に実データを差し替えてハイドレーション差異を回避
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    setHistory(getHistory());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleDelete = (id: string) => {
    deleteHistory(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (window.confirm('すべての占い履歴を削除しますか？')) {
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
          <p className="text-muted text-sm">過去の占い結果を振り返ることができます</p>
        </div>

        {history.length === 0 ? (
          <div className="border-border bg-surface rounded-2xl border p-12 text-center">
            <p className="text-muted">まだ占い履歴がありません</p>
            <Link href="/" className="text-gold mt-4 inline-block text-sm hover:underline">
              占いを始める &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleClearAll}
                className="text-muted hover:text-neon-red text-xs transition-colors"
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
                    className="border-border bg-surface hover:border-gold/30 rounded-2xl border p-5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {meta && <FortuneIcon type={meta.type} size="sm" />}
                          <h2 className="text-foreground text-sm font-bold">{entry.label}</h2>
                        </div>
                        <p className="text-muted line-clamp-3 text-xs leading-relaxed">
                          {entry.firstResponse}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-muted text-xs">
                            {new Date(entry.timestamp).toLocaleDateString('ja-JP')}
                          </span>
                          <Link
                            href={meta?.path || '/'}
                            className="text-gold text-xs hover:underline"
                          >
                            もう一度占う
                          </Link>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-muted hover:text-neon-red flex-shrink-0 text-xs transition-colors"
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
