import Link from 'next/link';
import FortuneIcon from '@/components/FortuneIcon';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0408] px-4">
      <div className="text-center">
        <FortuneIcon type="ai" size="lg" />
        <h1 className="font-mincho text-neon-red animate-neon-pulse mt-6 text-6xl font-bold">
          404
        </h1>
        <p className="font-yuji text-gold mt-4 text-xl">このページは見つかりませんでした</p>
        <p className="text-muted mt-2 text-sm">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="border-neon-red text-neon-red hover:bg-neon-red/10 hover:shadow-neon-red/20 rounded-full border-2 bg-transparent px-6 py-2.5 text-sm font-semibold transition-all hover:shadow-lg"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/tarot"
            className="border-gold/50 text-gold hover:bg-gold/10 rounded-full border bg-transparent px-6 py-2.5 text-sm transition-all"
          >
            タロットで運勢を占う
          </Link>
        </div>
      </div>
    </div>
  );
}
