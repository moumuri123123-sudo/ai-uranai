"use client";

import Link from "next/link";
import { useEffect } from "react";
import FortuneIcon from "@/components/FortuneIcon";

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
    <div className="min-h-screen bg-[#0a0408] flex items-center justify-center px-4">
      <div className="text-center">
        <FortuneIcon type="ai" size="lg" />
        <h1 className="font-mincho mt-6 text-4xl font-bold text-neon-red animate-neon-pulse sm:text-5xl">
          エラーが発生しました
        </h1>
        <p className="mt-4 font-yuji text-lg text-gold">
          星々の巡りが乱れたようです
        </p>
        <p className="mt-2 text-sm text-muted">
          ご不便をおかけして申し訳ありません。もう一度お試しください。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-full border-2 border-neon-red bg-transparent px-6 py-2.5 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/10 hover:shadow-lg hover:shadow-neon-red/20"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="rounded-full border border-gold/50 bg-transparent px-6 py-2.5 text-sm text-gold transition-all hover:bg-gold/10"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
