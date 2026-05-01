'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import FortuneIcon from '@/components/FortuneIcon';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログ（開発用）
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0408] px-4">
      <div className="text-center">
        <FortuneIcon type="ai" size="lg" />
        <h1 className="font-mincho text-neon-red animate-neon-pulse mt-6 text-4xl font-bold sm:text-5xl">
          エラーが発生しました
        </h1>
        <p className="font-yuji text-gold mt-4 text-lg">星々の巡りが乱れたようです</p>
        <p className="text-muted mt-2 text-sm">
          ご不便をおかけして申し訳ありません。もう一度お試しください。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="border-neon-red text-neon-red hover:bg-neon-red/10 hover:shadow-neon-red/20 rounded-full border-2 bg-transparent px-6 py-2.5 text-sm font-semibold transition-all hover:shadow-lg"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="border-gold/50 text-gold hover:bg-gold/10 rounded-full border bg-transparent px-6 py-2.5 text-sm transition-all"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
