import Link from "next/link";
import FortuneIcon from "@/components/FortuneIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0408] flex items-center justify-center px-4">
      <div className="text-center">
        <FortuneIcon type="ai" size="lg" />
        <h1 className="font-mincho mt-6 text-6xl font-bold text-neon-red animate-neon-pulse">
          404
        </h1>
        <p className="mt-4 font-yuji text-xl text-gold">
          このページは見つかりませんでした
        </p>
        <p className="mt-2 text-sm text-muted">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full border-2 border-neon-red bg-transparent px-6 py-2.5 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/10 hover:shadow-lg hover:shadow-neon-red/20"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/tarot"
            className="rounded-full border border-gold/50 bg-transparent px-6 py-2.5 text-sm text-gold transition-all hover:bg-gold/10"
          >
            タロットで運勢を占う
          </Link>
        </div>
      </div>
    </div>
  );
}
